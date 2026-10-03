import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/admin";
import { env, enabledProviders } from "@/lib/env";
import { getAvailablePack } from "@/lib/packs";
import { CONSENT_VERSION, newAccessToken } from "@/lib/submissions";
import { wompiCheckoutUrl } from "@/lib/payments/wompi";
import { stripeCheckoutUrl } from "@/lib/payments/stripe";
import { evaluationUrl, unlockSubmission } from "@/lib/payments";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const pack = getAvailablePack(clean(body.packId, 40));
  if (!pack) return NextResponse.json({ error: "Este pack no está disponible" }, { status: 400 });

  const nombre = clean(body.nombre, 120);
  const correo = clean(body.correo, 200).toLowerCase();
  const whatsapp = clean(body.whatsapp, 30).replace(/[^\d+]/g, "");
  const remitidoPor = clean(body.remitidoPor, 160);
  const proveedor = clean(body.proveedor, 10);

  if (nombre.length < 2) return NextResponse.json({ error: "Escribe tu nombre completo" }, { status: 400 });
  if (!EMAIL_RE.test(correo)) return NextResponse.json({ error: "Escribe un correo válido" }, { status: 400 });
  if (body.consentimiento !== true || body.mayorDeEdad !== true || body.tratamientoDatos !== true)
    return NextResponse.json({ error: "Debes aceptar el consentimiento, la política de datos y confirmar que eres mayor de edad" }, { status: 400 });
  if (pack.clinical && body.addendumClinico !== true)
    return NextResponse.json({ error: "Debes aceptar el addendum del consentimiento para packs clínicos" }, { status: 400 });

  const providers = enabledProviders();
  if (!(proveedor === "wompi" && providers.wompi) && !(proveedor === "stripe" && providers.stripe) && !(proveedor === "prueba" && providers.bypass))
    return NextResponse.json({ error: "Medio de pago no disponible" }, { status: 400 });

  const token = newAccessToken();
  const { data: sub, error: subErr } = await db()
    .from("submissions")
    .insert({
      access_token: token,
      pack_id: pack.id,
      cliente_nombre: nombre,
      cliente_correo: correo,
      cliente_whatsapp: whatsapp || null,
      remitido_por: remitidoPor || null,
      consentimiento_version: CONSENT_VERSION,
      consentimiento_aceptado_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (subErr || !sub) {
    console.error("[checkout] error creando submission", subErr);
    return NextResponse.json({ error: "No pudimos iniciar tu compra. Intenta de nuevo." }, { status: 500 });
  }

  const moneda = proveedor === "wompi" ? "COP" : "USD";
  const monto = proveedor === "wompi" ? pack.priceCop : pack.priceUsd;
  const { data: pay, error: payErr } = await db()
    .from("payments")
    .insert({ submission_id: sub.id, monto, moneda, proveedor })
    .select("id")
    .single();
  if (payErr || !pay) {
    console.error("[checkout] error creando pago", payErr);
    return NextResponse.json({ error: "No pudimos iniciar tu compra. Intenta de nuevo." }, { status: 500 });
  }

  const site = env.siteUrl();
  try {
    if (proveedor === "wompi") {
      const url = wompiCheckoutUrl({
        reference: pay.id,
        amountInCents: Math.round(monto * 100),
        redirectUrl: `${site}/pago/retorno?proveedor=wompi`,
        email: correo,
        fullName: nombre,
        phone: whatsapp,
      });
      return NextResponse.json({ url });
    }
    if (proveedor === "stripe") {
      const { url, sessionId } = await stripeCheckoutUrl({
        paymentId: pay.id,
        amountUsd: monto,
        productName: `Evaluación psicológica — ${pack.name}`,
        email: correo,
        successUrl: `${site}/pago/retorno?proveedor=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${site}/packs/${pack.id}?cancelado=1`,
      });
      await db().from("payments").update({ referencia_proveedor: sessionId }).eq("id", pay.id);
      return NextResponse.json({ url });
    }
    // Modo prueba (solo desarrollo): aprueba el pago sin cobrar.
    await db().from("payments").update({ estado: "aprobado" }).eq("id", pay.id);
    await unlockSubmission(sub.id);
    return NextResponse.json({ url: evaluationUrl(token) });
  } catch (e) {
    console.error("[checkout] error con el proveedor de pago", e);
    await db().from("payments").update({ estado: "error" }).eq("id", pay.id);
    return NextResponse.json({ error: "El proveedor de pago no respondió. Intenta de nuevo." }, { status: 502 });
  }
}
