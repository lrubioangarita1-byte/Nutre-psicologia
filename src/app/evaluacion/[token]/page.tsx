import { BRAND } from "@/lib/brand";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSubmissionByToken } from "@/lib/submissions";
import { getPack, type PackId } from "@/lib/packs";
import { TestRunner } from "@/components/TestRunner";
import { Results } from "@/components/Results";
import { Brand } from "@/components/Site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tu evaluación", robots: { index: false, follow: false } };

export default async function EvaluationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const sub = await getSubmissionByToken(token);
  const pack = sub && getPack(sub.pack_id);
  if (!sub || !pack) notFound();

  if (sub.estado === "esperando_pago") {
    return (
      <main className="narrow" style={{ padding: "60px 24px" }}>
        <Brand />
        <h1 style={{ marginTop: 32 }}>Estamos confirmando tu pago</h1>
        <p className="app-sub" style={{ marginTop: 12 }}>
          Apenas la pasarela lo apruebe te llegará un correo con el acceso. Puedes recargar esta página en unos minutos.
        </p>
        <a className="btn btn-primary" href={`/evaluacion/${token}`}>Recargar</a>
      </main>
    );
  }

  if (sub.estado === "en_progreso") {
    return (
      <TestRunner
        token={token}
        packId={pack.id as PackId}
        clientName={sub.cliente_nombre}
        initialResponses={sub.respuestas ?? {}}
        initialSafety={sub.respuesta_pregunta_seguridad}
      />
    );
  }

  return (
    <div>
      <div className="app-bar">
        <span className="brand-mini"><span className="mono">{BRAND.monogram}</span> {BRAND.product}</span>
        <span className="step-label">{sub.estado === "enviado" ? "Informe enviado" : "En revisión"}</span>
      </div>
      <div className="app-body">
        {sub.estado === "enviado" && (
          <div className="safety-note" style={{ marginBottom: 20 }}>
            <span aria-hidden="true">✉</span>
            <div><b>Tu informe ya fue enviado</b> a {sub.cliente_correo}. Revisa también la carpeta de spam o promociones.</div>
          </div>
        )}
        {sub.puntajes && <Results pack={pack} scores={sub.puntajes} crisis={sub.nivel_riesgo === "crisis"} />}
      </div>
    </div>
  );
}
