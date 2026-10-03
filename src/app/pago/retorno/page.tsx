import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Brand } from "@/components/Site";
import { verifyStripeSession, verifyWompiTransaction } from "@/lib/payments";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confirmando pago", robots: { index: false, follow: false } };

/** Retorno desde Wompi (?id=<transacción>) o Stripe (?session_id=<sesión>). */
export default async function PaymentReturn({
  searchParams,
}: {
  searchParams: Promise<{ proveedor?: string; id?: string; session_id?: string }>;
}) {
  const sp = await searchParams;
  let token: string | null = null;
  let failed = false;
  try {
    if (sp.proveedor === "wompi" && sp.id) token = await verifyWompiTransaction(sp.id);
    else if (sp.proveedor === "stripe" && sp.session_id) token = await verifyStripeSession(sp.session_id);
  } catch (e) {
    console.error("[retorno] error verificando el pago", e);
    failed = true;
  }
  if (token) redirect(`/evaluacion/${token}`);

  return (
    <main className="narrow" style={{ padding: "60px 24px" }}>
      <Brand />
      <h1 style={{ marginTop: 32 }}>{failed ? "No pudimos confirmar tu pago" : "Tu pago está en proceso"}</h1>
      <p className="app-sub" style={{ marginTop: 12 }}>
        {failed
          ? "Hubo un problema consultando la pasarela de pago. Si el cobro se realizó, te llegará un correo con tu enlace de acceso en unos minutos."
          : "Si el pago fue rechazado, puedes intentarlo de nuevo. Si quedó pendiente (por ejemplo, PSE), te enviaremos el enlace de acceso a tu correo en cuanto se apruebe."}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a className="btn btn-primary" href="">Volver a verificar</a>
        <a className="btn btn-ghost" href="/#servicios">Volver a los packs</a>
      </div>
    </main>
  );
}
