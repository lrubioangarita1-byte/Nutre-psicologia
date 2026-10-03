import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Site";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ConsentSummary, ClinicalAddendum } from "@/content/legal/consentimiento";
import { getAvailablePack } from "@/lib/packs";
import { enabledProviders } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  return { title: getAvailablePack(packId)?.name ?? "Pack" };
}

export default async function PackPage({
  params,
  searchParams,
}: {
  params: Promise<{ packId: string }>;
  searchParams: Promise<{ cancelado?: string }>;
}) {
  const { packId } = await params;
  const { cancelado } = await searchParams;
  const pack = getAvailablePack(packId);
  if (!pack) notFound();
  const providers = enabledProviders();
  const minutes = pack.instruments.reduce((m, i) => m + (i.kind === "game" ? 1 : Math.ceil(i.items.length / 4)), 0);

  return (
    <>
      <SiteHeader />
      <main className="narrow" style={{ padding: "40px 24px 72px" }}>
        <div className="pack-eyebrow">{pack.eyebrow}</div>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)" }}>{pack.name}</h1>
        <p className="app-sub" style={{ marginTop: 10 }}>{pack.description}</p>

        <div className="card">
          <ul className="pack-includes" style={{ marginBottom: 8 }}>
            {pack.includes.map((i) => <li key={i}>{i}</li>)}
          </ul>
          <div className="muted">Tiempo estimado: ~{minutes} minutos · Informe por correo en 12–24 horas</div>
          <div className="pack-price">
            ${pack.priceUsd}<small>USD</small>
            <small> · ${pack.priceCop.toLocaleString("es-CO")} COP</small>
          </div>
        </div>

        {cancelado && <div className="error-msg">El pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.</div>}

        <h2 style={{ fontSize: 22, margin: "28px 0 12px" }}>Consentimiento informado</h2>
        <div className="consent-box">
          <ConsentSummary />
          {pack.clinical && <ClinicalAddendum />}
        </div>

        <CheckoutForm
          packId={pack.id}
          clinical={pack.clinical}
          priceUsd={pack.priceUsd}
          priceCop={pack.priceCop}
          providers={providers}
        />
      </main>
      <SiteFooter />
    </>
  );
}

