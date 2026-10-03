import "server-only";
import Stripe from "stripe";
import { env } from "../env";

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!client) client = new Stripe(env.stripeSecret());
  return client;
}

export async function stripeCheckoutUrl(p: {
  paymentId: string;
  amountUsd: number;
  productName: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: p.email,
    client_reference_id: p.paymentId,
    metadata: { payment_id: p.paymentId },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(p.amountUsd * 100),
          product_data: { name: p.productName },
        },
      },
    ],
    success_url: p.successUrl,
    cancel_url: p.cancelUrl,
  });
  return { url: session.url!, sessionId: session.id };
}
