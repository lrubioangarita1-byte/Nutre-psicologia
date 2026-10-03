import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/supabase/admin";
import { getPack } from "@/lib/packs";
import { BRAND } from "@/lib/brand";
import { elevatedFlags, type QuestionInstrument } from "@/lib/instruments";
import type { Submission } from "@/lib/submissions";
import type { ReportDraft } from "@/lib/report";
import { ReportEditor } from "./ReportEditor";
import { markRiskReviewed } from "../../../actions";

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium", timeStyle: "short" }) : "—";

type RiskEvent = {
  id: string;
  tipo: "crisis" | "elevado";
  detalle: Record<string, unknown>;
  created_at: string;
  notificado_at: string | null;
  notificacion_error: string | null;
  revisado_por: string | null;
  revisado_at: string | null;
};

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [{ data: sub }, { data: report }, { data: events }, { data: payments }] = await Promise.all([
    db().from("submissions").select("*").eq("id", id).maybeSingle<Submission>(),
    db().from("reports").select("*").eq("submission_id", id).maybeSingle(),
    db().from("risk_events").select("*").eq("submission_id", id).order("created_at"),
    db().from("payments").select("monto, moneda, estado, proveedor, fecha").eq("submission_id", id).order("fecha"),
  ]);
  if (!sub) notFound();
  const pack = getPack(sub.pack_id);
  const wa = sub.cliente_whatsapp?.replace(/\D/g, "");

  return (
    <>
      <Link href="/admin" className="muted">← Volver a la lista</Link>
      <h1 style={{ fontSize: 26, margin: "10px 0 16px" }}>{sub.cliente_nombre}</h1>

      {sub.nivel_riesgo === "crisis" && (
        <div className="alert-box">
          <b>⚠ Protocolo de riesgo activado</b>
          El cliente respondió &quot;Sí&quot; a la pregunta de seguridad. Al cliente se le mostró el mensaje de crisis ({BRAND.crisisLine}).
          Haz contacto humano prioritario antes de enviar cualquier informe.
          {wa && (
            <div style={{ marginTop: 8 }}>
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" style={{ color: "#fff" }}>Abrir WhatsApp del cliente →</a>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <dl className="kv">
          <dt>Pack</dt><dd>{pack?.name ?? sub.pack_id}</dd>
          <dt>Correo</dt><dd><a href={`mailto:${sub.cliente_correo}`}>{sub.cliente_correo}</a></dd>
          <dt>WhatsApp</dt><dd>{wa ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener">{sub.cliente_whatsapp}</a> : "—"}</dd>
          <dt>Remitido por</dt><dd>{sub.remitido_por ?? "—"}</dd>
          <dt>Pregunta de seguridad</dt><dd>{sub.respuesta_pregunta_seguridad === null ? "Sin responder" : sub.respuesta_pregunta_seguridad ? "SÍ" : "No"}</dd>
          <dt>Estado</dt><dd>{sub.estado}</dd>
          <dt>Creado</dt><dd>{fmt(sub.fecha_creacion)}</dd>
          <dt>Pagado</dt><dd>{fmt(sub.pagado_at)}</dd>
          <dt>Empezó a responder</dt><dd>{fmt(sub.iniciado_at)}</dd>
          <dt>Terminado</dt><dd>{fmt(sub.completado_at)}</dd>
          <dt>Aceptación legal</dt>
          <dd>
            {sub.aceptacion
              ? `Versión ${sub.aceptacion.version} · ${fmt(sub.aceptacion.fecha)} · IP ${sub.aceptacion.ip ?? "—"} · ${sub.aceptacion.documentos.length} documentos`
              : "—"}
          </dd>
          <dt>Pagos</dt>
          <dd>{(payments ?? []).map((p, i) => <div key={i}>{p.proveedor} · {p.monto} {p.moneda} · {p.estado} · {fmt(p.fecha)}</div>)}</dd>
          {report?.fecha_envio && (<><dt>Informe enviado</dt><dd>{fmt(report.fecha_envio)} por {report.aprobado_por}</dd></>)}
        </dl>
      </div>

      {events && events.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 10 }}>Registro de eventos de riesgo</h3>
          {(events as RiskEvent[]).map((e) => (
            <div key={e.id} style={{ borderTop: "1px solid var(--line)", padding: "10px 0", fontSize: 14 }}>
              <span className={`pill ${e.tipo}`}>{e.tipo === "crisis" ? "CRISIS" : "Riesgo elevado"}</span>{" "}
              <b>{fmt(e.created_at)}</b>
              {Array.isArray(e.detalle.flags) && <ul style={{ margin: "6px 0" }}>{(e.detalle.flags as string[]).map((f) => <li key={f}>{f}</li>)}</ul>}
              <div className="muted">
                Notificación: {e.notificado_at ? `enviada ${fmt(e.notificado_at)}` : e.notificacion_error ? `FALLÓ — ${e.notificacion_error}` : "pendiente"}
                {" · "}
                {e.revisado_at ? `Atendido por ${e.revisado_por} (${fmt(e.revisado_at)})` : "Sin marcar como atendido"}
              </div>
              {!e.revisado_at && (
                <form action={markRiskReviewed.bind(null, e.id, sub.id)} style={{ marginTop: 6 }}>
                  <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 13 }}>Marcar como atendido / contactado</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {report && sub.puntajes ? (
        <ReportEditor
          submissionId={sub.id}
          initial={report.borrador as ReportDraft}
          sent={sub.estado === "enviado"}
          flags={elevatedFlags(sub.puntajes)}
        />
      ) : (
        <p className="muted">El cliente aún no ha terminado las pruebas; el borrador del informe se genera automáticamente al finalizar.</p>
      )}

      {pack && Object.keys(sub.respuestas ?? {}).length > 0 && (
        <details className="card">
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Ver respuestas ítem por ítem</summary>
          {pack.instruments.filter((i): i is QuestionInstrument => i.kind === "questions").map((inst) => {
            const ans = sub.respuestas[inst.id];
            if (!ans) return null;
            return (
              <div key={inst.id} style={{ marginTop: 14 }}>
                <b>{inst.name}</b>
                <ol style={{ fontSize: 13.5, paddingLeft: 22 }}>
                  {inst.items.map((it, i) => (
                    <li key={i}>{it} — <b>{ans[i] !== null && ans[i] !== undefined ? inst.scale[ans[i]!].l : "sin responder"}</b></li>
                  ))}
                </ol>
              </div>
            );
          })}
        </details>
      )}
    </>
  );
}
