import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const MotdRouter = createTRPCRouter({
  getMotd: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    if (!user)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Your session couldn't be validated!",
      });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const motd = await ctx.db.dashboardMessage.findFirst({
      where: { scheduledFor: { lte: today } },
      orderBy: { scheduledFor: "desc" },
    });
    const headerMessage =
      motd?.message ??
      "Hi {username}, let's create content that generates leads!";

    const subheaderMessage =
      motd?.submessage ?? "What are we posting this week?";

    return {
      header: headerMessage.replaceAll("{username}", user.name),
      subheader: subheaderMessage.replaceAll("{username}", user.name),
    };
  }),
});

export default MotdRouter;
