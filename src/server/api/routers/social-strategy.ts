import { createTRPCRouter, protectedProcedure } from "../trpc";

const SocialStrategyRouter = createTRPCRouter({
  getStrategies: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const strategies = await ctx.db.socialStrategy.findMany({
      where: { scheduledFor: { lte: today } },
      orderBy: { scheduledFor: "desc" },
      take: 3,
    });

    return strategies;
  }),
});

export default SocialStrategyRouter;
