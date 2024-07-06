import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const stripe = new Stripe(env.STRIPE_API_KEY);

export default createTRPCRouter({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findFirst({
      where: {
        AND: [{ status: "ACTIVE" }, { userId: ctx.session.user.id }],
      },
      include: {
        invoices: true,
      },
    });
    return subscription;
  }),
  purchase: protectedProcedure
    .input(z.enum(["LIFETIME_SPECIAL"]))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });

      const redirUrl = `${env.NEXTAUTH_URL.startsWith("http") ? env.NEXTAUTH_URL : `https://${env.NEXTAUTH_URL}`}`;

      const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: user.email,
        line_items: [
          {
            price: env.STRIPE_LIFETIME_PRODUCT,
            quantity: 1,
          },
        ],
        metadata: {
          userId: ctx.session.user.id,
          plan: input,
        },
        mode: "payment",
        success_url: `${redirUrl}/dashboard/settings/billing?stripeStatus=success`,
        cancel_url: `${redirUrl}/dashboard/settings/billing?stripeStatus=cancel`,
      });

      const subscription = await ctx.db.subscription.create({
        data: {
          status: "PENDING",
          invoices: {
            create: {
              status: "UNPAID",
              total: checkoutSession.amount_total ?? 0,
              stripeId: checkoutSession.id,
            },
          },
          tariff: "LIFETIME_SPECIAL",
          stripeSubscriptionId: checkoutSession.id,
          userId: ctx.session.user.id,
        },
      });

      return {
        subscription_id: subscription.id,
        checkout_url: checkoutSession.url,
      };
    }),
});
