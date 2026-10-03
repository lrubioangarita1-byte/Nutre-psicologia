import Link from "next/link";
import { db } from "@/lib/supabase/admin";
import { getPack } from "@/lib/packs";
import type { Submission } from "@/lib/submissions";

const TABS = {
  pendientes: { label: "Pendientes de revisión", estados: ["pendiente", "revisado"] },
  progreso: { label: "Respondiendo", estados: ["en_progreso"] },
  enviados: { label: "Enviados", estados: ["enviado"] },
  pago: { label: "Esperando pago", estados: ["esperando_pago"] },
} as const;
type Tab = keyof typeof TABS;

const RISK_ORDER = { crisis: 0, elevado: 1, normal: 2 } as const;
const RISK_LABEL = { crisis: "CRISIS", elevado: "Riesgo elevado", normal: "Normal" } as const;
const ESTADO_LABEL: Record<Submission["estado"], string> = {
  esperando_pago: "Esperando pago",
  en_progreso: "Respondiendo",
  pendiente: "Pendiente",
  revisado: "Borrador guardado",
  enviado: "Enviado",
};

function since(iso: string | null) {
  if (!iso) return "";
  const h = (Date.now() - new Date(iso).getTime()) / 36e5;
  if (h < 1) return `hace ${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `hace ${Math.round(h)} h`;
  return `hace ${Math.round(h / 24)} días`;
}

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: rawTab } = await searchParams;
  const tab: Tab = rawTab && rawTab in TABS ? (rawTab as Tab) : "pendientes";

  const { data, error } = await db()
    .from("submissions")
    .select("id, pack_id, cliente_nombre, cliente_correo, remitido_por, nivel_riesgo, estado, fecha_creacion, completado_at, respuesta_pregunta_seguridad")
    .in("estado", TABS[tab].estados as unknown as string[])
    .order("fecha_creacion", { ascending: false })
    .limit(300);

  const rows = (data ?? []) as Submission[];
  // Urgencia: crisis primero, luego riesgo elevado; dentro de cada nivel, el que más lleva esperando.
  if (tab === "pendientes") {
    rows.sort(
      (a, b) =>
        RISK_ORDER[a.nivel_riesgo] - RISK_ORDER[b.nivel_riesgo] ||
        new Date(a.completado_at ?? a.fecha_creacion).getTime() - new Date(b.completado_at ?? b.fecha_creacion).getTime(),
    );
  }

  // Crisis activas aunque el cliente no haya terminado las pruebas
  const { data: openCrisis } = await db()
    .from("submissions")
    .select("id, cliente_nombre")
    .eq("nivel_riesgo", "crisis")
    .eq("estado", "en_progreso");

  return (
    <>
      <h1 style={{ fontSize: 26 }}>Casos</h1>
      {openCrisis && openCrisis.length > 0 && (
        <div className="alert-box" style={{ marginTop: 16 }}>
          <b>⚠ Crisis reportada en evaluaciones aún sin terminar</b>
          {openCrisis.map((c) => (
            <div key={c.id}>
              <Link href={`/admin/casos/${c.id}`} style={{ color: "#fff" }}>{c.cliente_nombre}</Link>
            </div>
          ))}
        </div>
      )}
      <nav className="tabs">
        {(Object.keys(TABS) as Tab[]).map((t) => (
          <Link key={t} href={`/admin?tab=${t}`} className={`tab${t === tab ? " active" : ""}`}>
            {TABS[t].label}
          </Link>
        ))}
      </nav>
      {error && <div className="error-msg">Error cargando casos: {error.message}</div>}
      {rows.length === 0 ? (
        <p className="muted">No hay casos en esta lista.</p>
      ) : (
        <div className="case-list">
          {rows.map((r) => (
            <Link key={r.id} href={`/admin/casos/${r.id}`} className="case-row">
              <span className={`pill ${r.nivel_riesgo}`}>{RISK_LABEL[r.nivel_riesgo]}</span>
              <div>
                <div className="who">{r.cliente_nombre}</div>
                <div className="meta">
                  {getPack(r.pack_id)?.name ?? r.pack_id} · {r.cliente_correo}
                  {r.remitido_por ? ` · Remitido por ${r.remitido_por}` : ""}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="pill estado">{ESTADO_LABEL[r.estado]}</span>
                <div className="meta">{r.completado_at ? `Terminó ${since(r.completado_at)}` : `Creado ${since(r.fecha_creacion)}`}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
