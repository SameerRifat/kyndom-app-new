import { GetFavouritesSchema } from "@/lib/schemas/favourites";
import { Template } from "@/lib/schemas/generic";
import {
  UpdateAccountSchema,
  UpdatePasswordSchema,
} from "@/lib/schemas/settings";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export default createTRPCRouter({
  permissions: protectedProcedure.query(async ({ ctx }) => {
    const permissions = await ctx.permissions.get(true);
    return permissions;
  }),
  isAuthenticated: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user) return null;
    return { name: ctx.session.user.name };
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { subscriptions: true },
    });
  
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Couldn't authenticate your request!",
      });
    }
  
    let subscription_status = "NOT_ACTIVE";
  
    if (user.subscriptions.some((s) => s.status === "ACTIVE")) {
      subscription_status = "ACTIVE";
    }
  
    const { subscriptions, password, ...rest } = user;
  
    return { ...rest, subscription_status };
  }),
  
  // me: protectedProcedure.query(async ({ ctx }) => {
  //   const user = await ctx.db.user.findUnique({
  //     where: { id: ctx.session.user.id },
  //     include: { subscriptions: true },
  //   });
  //   if (!user)
  //     throw new TRPCError({
  //       code: "UNAUTHORIZED",
  //       message: "Couldn't authenticate your request!",
  //     });

  //   return { ...user, ...{ password: null } };
  // }),
  updatePassword: protectedProcedure
    .input(UpdatePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
      });
      if (
        !user ||
        !user.password ||
        !(await bcrypt.compare(input.current_password, user.password))
      )
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid current password!",
        });

      const newPasswordHash = await bcrypt.hash(input.new_password, 10);

      await ctx.db.user.update({
        where: { id: user.id },
        data: { password: newPasswordHash },
      });

      return true;
    }),
  updateAccount: protectedProcedure
    .input(UpdateAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Your user profile couldn't be found!",
        });

      await ctx.db.user.update({
        where: { id: user.id },
        data: {
          name: input.name,
          email: input.email,
        },
      });

      return true;
    }),
  getFavouriteTemplates: protectedProcedure
    .input(GetFavouritesSchema)
    .query(async ({ ctx, input }) => {
      let whereAnd = [{ likedByUserIds: { has: ctx.session.user.id } }] as any;

      if (input.filter_tags) {
        whereAnd.push({
          tagId: { in: input.filter_tags },
        });
      }

      // If the user selected to filter by month(s), we can do this by converting the months
      // into an array of objects like { createdAt: { gte: MONTH START, lte: MONTH END } } and
      // pass it as OR inside there where->And query
      if (input.filter_months) {
        let orFilter: any = [];
        input.filter_months.forEach((m) => {
          const date = new Date(m);
          const startDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), 1),
          );
          const endDate = new Date(
            Date.UTC(
              date.getFullYear(),
              date.getMonth() + 1,
              0,
              23,
              59,
              59,
              999,
            ),
          );

          orFilter.push({
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          });
        });
        whereAnd.push({
          OR: orFilter,
        });
      }

      let socialContentQuery = [...whereAnd];
      if (input.filter_category_social_content) {
        socialContentQuery.push({
          category: { in: input.filter_category_social_content },
        });
      }

      let socialTextQuery = [...whereAnd];
      if (input.filter_category_social_text) {
        socialTextQuery.push({
          category: { in: input.filter_category_social_text },
        });
      }

      // Below, were checking if one type of template (text) has filters on it's category type
      // e.g (STORY IDEAS, REELS IDEAS), and the content template has no filters. If so we should
      // take none of the content templates. Same applies with shouldTakeText but reversed
      const shouldTakeContent =
        !input.filter_category_social_text || //If the user picked no text filters
        (input.filter_category_social_text && //OR if they picked atleast one text filter and one content filter
          input.filter_category_social_text?.length > 0 &&
          input.filter_category_social_content &&
          input.filter_category_social_content?.length > 0);

      const shouldTakeText =
        !input.filter_category_social_content || //If the user picked no content filters
        (input.filter_category_social_content && //Or the user picked atleast one content filter and one text filter
          input.filter_category_social_content?.length > 0 &&
          input.filter_category_social_text &&
          input.filter_category_social_text?.length > 0);

      // const sortBy: Prisma.SortOrder = 'desc'
      const sortBy: Prisma.SortOrder =
        input.sort_by === "newest" ? "desc" : "asc";

      let baseQuery = {
        where: { AND: whereAnd },
        include: { tag: true },
        skip: input.skip ? input.skip : 0,
        take: input.take && input.take <= 50 ? input.take : 50,
        orderBy: {
          createdAt: sortBy,
        },
      };

      const totalContentTemplates = await ctx.db.socialContentTemplate.count({
        where: { AND: socialContentQuery },
      });
      const socialContentTemplates =
        await ctx.db.socialContentTemplate.findMany({
          ...baseQuery,
          where: {
            AND: socialContentQuery,
          },
          include: { ...baseQuery.include, previewImages: true },
          take: shouldTakeContent ? baseQuery.take : 0,
        });
      const contentTemplates = socialContentTemplates.map((st) => ({
        ...st,
        liked: true,
        type: "socialContent",
      }));

      const totalTextTemplates = await ctx.db.socialTextTemplate.count({
        where: { AND: socialTextQuery },
      });
      const socialTextTemplates = await ctx.db.socialTextTemplate.findMany({
        ...baseQuery,
        where: {
          AND: socialTextQuery,
        },
        include: baseQuery.include,
        take: shouldTakeText ? baseQuery.take : 0,
      });
      const textTemplates = socialTextTemplates.map((st) => ({
        ...st,
        liked: true,
        type: "socialText",
      }));

      let templateResults = [
        ...contentTemplates,
        ...textTemplates,
      ] as Template[];

      // if (sortBy === "desc") {
      //   templateResults = templateResults.sort(
      //     (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      //   );
      // } else if (sortBy === "asc") {
      //   templateResults = templateResults.sort(
      //     (a, b) => b.createdAt.getTime() + a.createdAt.getTime(),
      //   );
      // }

      return {
        total: totalContentTemplates + totalTextTemplates,
        templates: templateResults,
      };
    }),
});
