import "server-only";
import { db } from "../supabase/admin";
import { env } from "../env";
import { sendAccessLink } from "../email";
import { getPack } from "../packs";
import { getWompiTransaction } from "./wompi";
import { stripe } from "./stripe";

export function evaluationUrl(token: string) {
  return `${env.siteUrl()}/evaluacion/${token}`;
}

type PaymentRow = {
  id: string;
  submission_id: string;
  monto: number;
  moneda: "COP" | "USD";
  estado: string;
  proveedor: string;
};

/**
 * Aplica el resultado verificado de un pago. Idempotente: puede llamarse desde el
 * retorno del checkout y desde el webhook; el correo de acceso se envía una sola vez.
 * Devuelve el token de acceso si el pago quedó aprobado.
 */
export async function applyPaymentResult(
  paymentId: string,
  result: { approved: boolean; amountMinor: number; currency: string; providerRef: string; detail: unknown },
): Promise<string | null> {
  const { data: pay } = await db().from("payments").select("*").eq("id", paymentId).single<PaymentRow>();
  if (!pay) return null;

  const expectedMinor = Math.round(Number(pay.monto) * 100);
  const amountOk = result.amountMinor === expectedMinor && result.currency.toUpperCase() === pay.moneda;
  const estado = result.approved && amountOk ? "aprobado" : result.approved ? "error" : "rechazado";
  if (result.approved && !amountOk) {
    console.error(`[pagos] monto/moneda no coinciden en pago ${pay.id}: ${result.amountMinor} ${result.currency}`);
  }

  if (pay.estado !== "aprobado") {
    await db()
      .from("payments")
      .update({ estado, referencia_proveedor: result.providerRef, detalle: result.detail })
      .eq("id", pay.id);
  }
  if (estado !== "aprobado" && pay.estado !== "aprobado") return null;

  return unlockSubmission(pay.submission_id);
}

/** Pasa la evaluación a "en_progreso" (una sola vez) y envía el enlace de acceso. */
export async function unlockSubmission(submissionId: string): Promise<string | null> {
  const { data: updated } = await db()
    .from("submissions")
    .update({ estado: "en_progreso", pagado_at: new Date().toISOString() })
    .eq("id", submissionId)
    .eq("estado", "esperando_pago")
    .select("access_token, cliente_correo, cliente_nombre, pack_id");

  const { data: sub } = await db()
    .from("submissions")
    .select("access_token, cliente_correo, cliente_nombre, pack_id")
    .eq("id", submissionId)
    .single();
  if (!sub) return null;

  if (updated && updated.length > 0) {
    try {
      await sendAccessLink(sub.cliente_correo, sub.cliente_nombre, getPack(sub.pack_id)?.name ?? sub.pack_id, evaluationUrl(sub.access_token));
    } catch (e) {
      console.error("[pagos] no se pudo enviar el enlace de acceso", e);
    }
  }
  return sub.access_token;
}

export async function verifyWompiTransaction(transactionId: string) {
  const tx = await getWompiTransaction(transactionId);
  if (!tx) return null;
  return applyPaymentResult(tx.reference, {
    approved: tx.status === "APPROVED",
    amountMinor: tx.amount_in_cents,
    currency: tx.currency,
    providerRef: tx.id,
    detail: { status: tx.status },
  });
}

export async function verifyStripeSession(sessionId: string) {
  const s = await stripe().checkout.sessions.retrieve(sessionId);
  const paymentId = s.metadata?.payment_id;
  if (!paymentId) return null;
  return applyPaymentResult(paymentId, {
    approved: s.payment_status === "paid",
    amountMinor: s.amount_total ?? 0,
    currency: s.currency ?? "",
    providerRef: s.id,
    detail: { payment_status: s.payment_status, payment_intent: s.payment_intent },
  });
}
