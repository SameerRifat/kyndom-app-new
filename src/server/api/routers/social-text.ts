import { Template } from "@/lib/schemas/generic";
import { GetRecentTextTemplatesSchema } from "@/lib/schemas/home";
import { LikeSocialTemplate } from "@/lib/schemas/social-content";
import { SearchTextTemplatesSchema } from "@/lib/schemas/social-text";
import { ZodObjectId } from "@/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  subscriptionProcedure,
} from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export default createTRPCRouter({
  getRecentTextTemplates: protectedProcedure
    .input(GetRecentTextTemplatesSchema)
    .query(async ({ ctx, input }) => {
      const socialTemplatesData = await ctx.db.socialTextTemplate.findMany({
        where: { category: input.category },
        orderBy: { createdAt: "desc" },
        take: input.take ?? 4,
        include: { tag: true },
      });
      const socialTemplates = socialTemplatesData.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialText",
          liked: userLiked,
        };
      }) as Template[];
      return socialTemplates;
    }),
  getSocialTextTemplate: subscriptionProcedure
    .input(ZodObjectId)
    .query(async ({ ctx, input }) => {
      const socialTemplate = await ctx.db.socialTextTemplate.findFirst({
        where: { id: String(input) },
        include: { tag: true },
      });
      if (!socialTemplate)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "This social content couldn't be found, or you don't have permission to view it!",
        });
      return socialTemplate;
    }),
  getSocialTextTemplates: subscriptionProcedure
    .input(SearchTextTemplatesSchema)
    .query(async ({ ctx, input }) => {
      let whereAnd = [
        {
          title: {
            contains: input.filter_title,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
      ] as any;

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

      if (input.filter_category) {
        whereAnd.push({
          category: { in: input.filter_category },
        });
      }

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

      const totalTextTemplates = await ctx.db.socialTextTemplate.count({
        where: { AND: whereAnd },
      });
      const socialTextTemplates =
        await ctx.db.socialTextTemplate.findMany(baseQuery);

      const socialTemplates = socialTextTemplates.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialText",
          liked: userLiked,
        };
      }) as Template[];

      return {
        total: totalTextTemplates,
        templates: socialTemplates,
      };
    }),
  getFavouriteSocialTextTemplates: subscriptionProcedure.query(
    async ({ ctx }) => {
      const socialTemplates = await ctx.db.socialTextTemplate.findMany({
        where: { likedByUserIds: { has: ctx.session.user.id } },
        include: { tag: true },
      });

      return socialTemplates.map((template) => {
        return {
          ...template,
          liked: true,
        };
      });
    },
  ),
  likeSocialTextTemplate: subscriptionProcedure
    .input(LikeSocialTemplate)
    .mutation(async ({ ctx, input }) => {
      const socialPostTemplate = await ctx.db.socialTextTemplate.findFirst({
        where: { id: input.id },
      });
      if (!socialPostTemplate)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Social template not found!",
        });

      if (socialPostTemplate.likedByUserIds.includes(ctx.session.user.id)) {
        await ctx.db.socialTextTemplate.update({
          where: { id: input.id },
          data: {
            likedByUserIds: socialPostTemplate.likedByUserIds.filter(
              (u) => u !== ctx.session.user.id,
            ),
          },
        });
      } else {
        await ctx.db.socialTextTemplate.update({
          where: { id: input.id },
          data: {
            likedByUserIds: socialPostTemplate.likedByUserIds.concat([
              ctx.session.user.id,
            ]),
          },
        });
      }

      return true;
    }),
});
