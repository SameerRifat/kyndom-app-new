import { Template } from "@/lib/schemas/generic";
import { GetRecentContentTemplatesSchema } from "@/lib/schemas/home";
import {
  LikeSocialTemplate,
  SearchContentTemplatesSchema,
} from "@/lib/schemas/social-content";
import { ZodObjectId } from "@/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  subscriptionProcedure,
} from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export default createTRPCRouter({
  getTodaysPost: protectedProcedure
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const timezoneOffset = today.getTimezoneOffset() * 60000;

      const todayStart = new Date(today.getTime() - timezoneOffset);
      todayStart.setUTCHours(0, 0, 0, 0);

      const todayEnd = new Date(today.getTime() - timezoneOffset);
      todayEnd.setUTCHours(23, 59, 59, 999);

      // Query for today's template
      let socialTemplatesData = await ctx.db.socialContentTemplate.findMany({
        where: {
          releaseDate: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        orderBy: { createdAt: "desc" },
        include: { tag: true, previewImages: true },
      });

      // If no template is found for today, query for the latest template before today
      if (socialTemplatesData.length === 0) {
        socialTemplatesData = await ctx.db.socialContentTemplate.findMany({
          where: {
            releaseDate: {
              lt: todayStart,
            },
          },
          orderBy: { releaseDate: "desc" },
          take: 1,
          include: { tag: true, previewImages: true },
        });
      }

      const socialTemplates = socialTemplatesData.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialContent",
          liked: userLiked,
        };
      }) as Template[];

      return socialTemplates;
    }),
  getRecentTemplates: protectedProcedure
    .input(GetRecentContentTemplatesSchema)
    .query(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const socialTemplatesData = await ctx.db.socialContentTemplate.findMany({
        where: { category: input.category },
        orderBy: { createdAt: "desc" },
        take: input.take ?? 4,
        include: { tag: true, previewImages: true },
      });
      const socialTemplates = socialTemplatesData.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialContent",
          liked: userLiked,
        };
      }) as Template[];
      return socialTemplates;
    }),
  getSocialContentTemplate: subscriptionProcedure
    .input(ZodObjectId)
    .query(async ({ ctx, input }) => {
      const socialTemplate = await ctx.db.socialContentTemplate.findFirst({
        where: { id: String(input) },
        include: { tag: true, previewImages: true },
      });
      if (!socialTemplate)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "This social content couldn't be found, or you don't have permission to view it!",
        });
      return socialTemplate;
    }),
  getSocialContentTemplates: subscriptionProcedure
    .input(SearchContentTemplatesSchema)
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

      // const sortBy: Prisma.SortOrder = "desc"
      const sortBy: Prisma.SortOrder =
        input.sort_by === "newest" ? "desc" : "asc";

      let baseQuery = {
        where: { AND: whereAnd },
        include: { tag: true, previewImages: true },
        skip: input.skip ? input.skip : 0,
        take: input.take && input.take <= 50 ? input.take : 50,
        orderBy: {
          createdAt: sortBy,
        },
      };

      const totalContentTemplates = await ctx.db.socialContentTemplate.count({
        where: { AND: whereAnd },
      });
      const socialContentTemplates =
        await ctx.db.socialContentTemplate.findMany(baseQuery);

      const socialTemplates = socialContentTemplates.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialContent",
          liked: userLiked,
        };
      }) as Template[];

      return {
        total: totalContentTemplates,
        templates: socialTemplates,
      };
    }),
  getSocialTemplateTags: subscriptionProcedure.query(async ({ ctx }) => {
    const socialTemplateTags = await ctx.db.socialTemplateTag.findMany();
    return socialTemplateTags;
  }),
  likeSocialContentTemplate: subscriptionProcedure
    .input(LikeSocialTemplate)
    .mutation(async ({ ctx, input }) => {
      const socialPostTemplate = await ctx.db.socialContentTemplate.findFirst({
        where: { id: input.id },
      });
      if (!socialPostTemplate)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Social template not found!",
        });

      if (
        socialPostTemplate.likedByUserIds.includes(ctx.session.user.id) &&
        input.status === false
      ) {
        await ctx.db.socialContentTemplate.update({
          where: { id: input.id },
          data: {
            likedByUserIds: socialPostTemplate.likedByUserIds.filter(
              (u) => u !== ctx.session.user.id,
            ),
          },
        });
      } else if (
        !socialPostTemplate.likedByUserIds.includes(ctx.session.user.id) &&
        input.status === true
      ) {
        await ctx.db.socialContentTemplate.update({
          where: { id: input.id },
          data: {
            likedByUserIds: socialPostTemplate.likedByUserIds.concat([
              ctx.session.user.id,
            ]),
          },
        });
      }

      const socialPostTemplateUpdated = await ctx.db.socialContentTemplate.findFirst({
        where: { id: input.id },
      });

      return true;
    }),
});
