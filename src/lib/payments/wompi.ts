import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "../env";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function apiBase() {
  return env.wompiPublicKey().startsWith("pub_prod_")
    ? "https://production.wompi.co/v1"
    : "https://sandbox.wompi.co/v1";
}

/** URL del Web Checkout de Wompi (redirección). */
export function wompiCheckoutUrl(p: {
  reference: string;
  amountInCents: number;
  redirectUrl: string;
  email: string;
  fullName: string;
  phone?: string | null;
}) {
  const currency = "COP";
  const signature = sha256(`${p.reference}${p.amountInCents}${currency}${env.wompiIntegritySecret()}`);
  const q = new URLSearchParams({
    "public-key": env.wompiPublicKey(),
    currency,
    "amount-in-cents": String(p.amountInCents),
    reference: p.reference,
    "signature:integrity": signature,
    "redirect-url": p.redirectUrl,
    "customer-data:email": p.email,
    "customer-data:full-name": p.fullName,
  });
  const digits = p.phone?.replace(/\D/g, "");
  if (digits && digits.length >= 10) {
    q.set("customer-data:phone-number", digits.slice(-10));
    q.set("customer-data:phone-number-prefix", digits.length > 10 ? `+${digits.slice(0, -10)}` : "+57");
  }
  return `https://checkout.wompi.co/p/?${q.toString()}`;
}

export type WompiTransaction = {
  id: string;
  status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
  reference: string;
  amount_in_cents: number;
  currency: string;
};

/** Consulta una transacción directamente a la API de Wompi (fuente de verdad). */
export async function getWompiTransaction(id: string): Promise<WompiTransaction | null> {
  if (!/^[\w-]+$/.test(id)) return null;
  const res = await fetch(`${apiBase()}/transactions/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
}

/** Verifica la firma de un evento (webhook) de Wompi. */
export function verifyWompiEvent(body: {
  data?: unknown;
  timestamp?: number;
  signature?: { properties?: string[]; checksum?: string };
}): boolean {
  const secret = env.wompiEventsSecret();
  if (!secret || !body.signature?.properties || !body.signature.checksum || body.timestamp === undefined) return false;
  const values = body.signature.properties.map((path) =>
    path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], body.data),
  );
  const expected = sha256(values.map((v) => String(v)).join("") + String(body.timestamp) + secret);
  const a = Buffer.from(expected.toLowerCase());
  const b = Buffer.from(String(body.signature.checksum).toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}
