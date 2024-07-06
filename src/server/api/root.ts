import authRouter from "@/server/api/routers/auth";
import billingRouter from "@/server/api/routers/billing";
import contentCalendarRouter from "@/server/api/routers/content-calendar";
import contentVaultRouter from "@/server/api/routers/content-vault";
import socialContentRouter from "@/server/api/routers/social-content";
import socialTextRouter from "@/server/api/routers/social-text";
import userRouter from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import motdRouter from "./routers/motd";
import socialStrategyRouter from "./routers/social-strategy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  billing: billingRouter,
  socialText: socialTextRouter,
  socialContent: socialContentRouter,
  socialStrategy: socialStrategyRouter,
  contentVault: contentVaultRouter,
  contentCalendar: contentCalendarRouter,
  motd: motdRouter,
  user: userRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
