import { SearchContentVaultSchema } from "@/lib/schemas/content-vault";
import { Template } from "@/lib/schemas/generic";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, subscriptionProcedure } from "../trpc";

export default createTRPCRouter({
  search: subscriptionProcedure
    .input(SearchContentVaultSchema)
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
      // const contentTemplates = socialContentTemplates.map((st) => ({
      //   ...st,
      //   type: "socialContent",
      // }));

      const contentTemplates = socialContentTemplates.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialContent",
          liked: userLiked,
        };
      }) as Template[];

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
      // const textTemplates = socialTextTemplates.map((st) => ({
      //   ...st,
      //   type: "socialText",
      // }));
      const socialTemplates = socialTextTemplates.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialText",
          liked: userLiked,
        };
      }) as Template[];

      let templateResults = [
        ...contentTemplates,
        ...socialTemplates,
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
