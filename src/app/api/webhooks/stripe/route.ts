import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/payments/stripe";
import { verifyStripeSession } from "@/lib/payments";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig ?? "", env.stripeWebhookSecret());
  } catch {
    return NextResponse.json({ error: "firma inválida" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    await verifyStripeSession(event.data.object.id);
  }
  return NextResponse.json({ received: true });
}
