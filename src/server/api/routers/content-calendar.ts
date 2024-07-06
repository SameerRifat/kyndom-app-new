import { Template } from "@/lib/schemas/generic";
import { z } from "zod";
import { createTRPCRouter, subscriptionProcedure } from "../trpc";
import { SocialContentCategory } from "@prisma/client";

// Define the Zod schema
const getCalendarInputSchema = z.object({
  date: z.date(),
  filter_tags: z.array(z.string()).optional(),
  filter_category: z.array(z.string()).optional(),
  skip: z.number(),
  take: z.number(),
});

export default createTRPCRouter({
  getCalendar: subscriptionProcedure
    .input(getCalendarInputSchema)
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date);

      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const filterCategories = input.filter_category?.map(category => category as SocialContentCategory);

      const whereClause = {
        releaseDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
        ...(input.filter_tags && input.filter_tags.length > 0 && {
          tagId: {
            in: input.filter_tags,
          },
        }),
        ...(filterCategories && filterCategories.length > 0 && {
          category: {
            in: filterCategories,
          },
        }),
      };

      // Count the total number of templates matching the whereClause
      const totalTemplatesCount = await ctx.db.socialContentTemplate.count({
        where: whereClause,
      });

      // Fetch the templates with pagination
      const calendarTemplates = await ctx.db.socialContentTemplate.findMany({
        where: whereClause,
        include: { tag: true, previewImages: true },
        // skip: input.skip || 0, 
        // take: input.take && input.take <= 50 ? input.take : 50, 
        skip: input.skip || 0,
        take: input.take, 
        orderBy: { releaseDate: "asc" },
      });

      // Map the templates to include the "liked" property
      const mappedTemplates = calendarTemplates.map((template) => {
        const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
        return {
          ...template,
          type: "socialContent",
          liked: userLiked,
        };
      }) as Template[];

      // Return the total count and the fetched templates
      return {
        total: totalTemplatesCount,
        templates: mappedTemplates,
      };
    }),
  // getCalendar: subscriptionProcedure
  //   .input(getCalendarInputSchema)
  //   .query(async ({ ctx, input }) => {
  //     const date = new Date(input.date);

  //     const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  //     const lastDayOfMonth = new Date(
  //       date.getFullYear(),
  //       date.getMonth() + 1,
  //       0,
  //     );

  //     const filterCategories = input.filter_category?.map(category => category as SocialContentCategory);

  //     const calendarTemplates = await ctx.db.socialContentTemplate.findMany({
  //       where: {
  //         releaseDate: {
  //           gte: firstDayOfMonth,
  //           lte: lastDayOfMonth,
  //         },
  //         ...(input.filter_tags && input.filter_tags.length > 0 && {
  //           tagId: {
  //             in: input.filter_tags,
  //           },
  //         }),
  //         ...(filterCategories && filterCategories.length > 0 && {
  //           category: {
  //             in: filterCategories,
  //           },
  //         }),
  //       },
  //       include: { tag: true, previewImages: true },
  //       orderBy: { releaseDate: "asc" },
  //     });

  //     const mappedTemplates = calendarTemplates.map((template) => {
  //       const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
  //       return {
  //         ...template,
  //         type: "socialContent",
  //         liked: userLiked,
  //       };
  //     }) as Template[];

  //     return mappedTemplates;
  //   }),
  getCalendarStyles: subscriptionProcedure.query(async ({ ctx }) => {
    const calendarStyles = await ctx.db.contentCalendarStyle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return calendarStyles;
  }),
});



// import { Template } from "@/lib/schemas/generic";
// import { z } from "zod";
// import { createTRPCRouter, subscriptionProcedure } from "../trpc";

// export default createTRPCRouter({
//   getCalendar: subscriptionProcedure
//     .input(z.date())
//     .query(async ({ ctx, input }) => {
//       const date = new Date(input);

//       const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
//       const lastDayOfMonth = new Date(
//         date.getFullYear(),
//         date.getMonth() + 1,
//         0,
//       );

//       const calendarTemplates = await ctx.db.socialContentTemplate.findMany({
//         where: {
//           releaseDate: {
//             gte: firstDayOfMonth,
//             lte: lastDayOfMonth,
//           },
//         },
//         include: { tag: true, previewImages: true },
//         orderBy: { releaseDate: "asc" },
//       });

//       const mappedTemplates = calendarTemplates.map((template) => {
//         const userLiked = template.likedByUserIds.includes(ctx.session.user.id);
//         return {
//           ...template,
//           type: "socialContent",
//           liked: userLiked,
//         };
//       }) as Template[];

//       return mappedTemplates;
//     }),
//   getCalendarStyles: subscriptionProcedure.query(async ({ ctx }) => {
//     const calendarStyles = await ctx.db.contentCalendarStyle.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     return calendarStyles;
//   }),
// });
