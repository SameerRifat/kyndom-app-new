import { env } from "@/env";
import { db } from "@/server/db";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_API_KEY);

export const POST = async (req: Request) => {
  const payload = await req.text();

  const stripeSignature = req.headers.get("stripe-signature");
  if (!stripeSignature)
    return Response.json({ success: false }, { status: 403 });

  try {
    const event = await stripe.webhooks.constructEventAsync(
      payload,
      stripeSignature,
      env.STRIPE_WEBHOOK_SECRET,
    );


    switch (event.type) {
      case "checkout.session.completed": {
        const webhookEvent = event as Stripe.CheckoutSessionCompletedEvent;
        const checkoutCompletedEvent = webhookEvent.data.object;

        const invoice = await db.subscriptionInvoice.findFirst({
          where: { stripeId: checkoutCompletedEvent.id },
          include: { subscription: true },
        });
        if (!invoice) return Response.json({ success: false }, { status: 404 });

        await db.subscriptionInvoice.update({
          where: { id: invoice.id },
          data: {
            status: "PAID",
          },
        });

        await db.subscription.update({
          where: { id: invoice.subscription.id },
          data: {
            status: "ACTIVE",
            expiresAt: undefined,
          },
        });

        break;
      }
      default: {
        console.log(`[+] Received unhandled Stripe event ${event.type}`);
        break;
      }
    }
  } catch (e) {
    console.log(e);
    return Response.json(
      { success: false, error: e?.toString() ?? e },
      { status: 403 },
    );
  }

  return Response.json({ success: true }, { status: 200 });
};
