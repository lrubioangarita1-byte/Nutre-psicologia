"use client";

import { useMemo, useState, useTransition } from "react";
import { renderReportHtml, type ReportDraft } from "@/lib/report";
import { approveAndSend, saveDraft } from "../../../actions";

type Props = { submissionId: string; initial: ReportDraft; sent: boolean; flags: string[] };

export function ReportEditor({ submissionId, initial, sent, flags }: Props) {
  const [d, setD] = useState<ReportDraft>(initial);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [preview, setPreview] = useState(false);
  const [pending, start] = useTransition();
  const readOnly = sent;

  const html = useMemo(() => (preview ? renderReportHtml(d, new Date()) : ""), [preview, d]);

  const setTip = (ii: number, li: number, tip: string) =>
    setD({ ...d, instruments: d.instruments.map((inst, a) => (a !== ii ? inst : { ...inst, lines: inst.lines.map((l, b) => (b !== li ? l : { ...l, tip })) })) });
  const setExercise = (i: number, field: "title" | "text", v: string) =>
    setD({ ...d, exercises: d.exercises.map((e, a) => (a !== i ? e : { ...e, [field]: v })) });

  function onSave() {
    setMsg(null);
    start(async () => {
      await saveDraft(submissionId, d);
      setMsg({ kind: "ok", text: "Borrador guardado." });
    });
  }

  function onSend() {
    if (!confirm(`¿Aprobar y enviar el informe a ${d.clientName}? Esta acción envía el correo de inmediato.`)) return;
    setMsg(null);
    start(async () => {
      const r = await approveAndSend(submissionId, d);
      setMsg(r.ok ? { kind: "ok", text: "Informe aprobado y enviado al cliente." } : { kind: "error", text: r.error ?? "Error" });
    });
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, margin: "28px 0 12px" }}>Informe {sent ? "(enviado)" : "— borrador editable"}</h2>
      {flags.length > 0 && (
        <div className="card" style={{ borderLeft: "4px solid var(--coral)" }}>
          <b>Umbrales de riesgo superados:</b>
          <ul style={{ margin: "6px 0 0" }}>{flags.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}

      <div className="r-header">
        <b>Cliente:</b> {d.clientName} · <b>Pack:</b> {d.packName}
        {d.referredBy && <> · <b>Remitido por:</b> {d.referredBy}</>}
      </div>

      <h3 style={{ marginBottom: 10 }}>Resultados por instrumento</h3>
      {d.instruments.map((inst, ii) => (
        <div className="r-card" key={ii}>
          <h4>{inst.title}</h4>
          {inst.lines.map((l, li) => (
            <div key={li} style={{ marginTop: li ? 12 : 0 }}>
              <div className="result-score" style={{ fontSize: 18 }}>{l.label ? `${l.label}: ` : ""}{l.score}</div>
              <div className="gauge"><div className={`gauge-fill${l.risky ? " risky" : ""}`} style={{ width: `${l.pct}%` }} /></div>
              <div className="result-band">{l.band}</div>
              <label>Comentario / consejo (editable{l.tip ? "" : " — vacío no se muestra"})</label>
              <textarea className="edit" value={l.tip} readOnly={readOnly} onChange={(e) => setTip(ii, li, e.target.value)} />
            </div>
          ))}
          {inst.note && <div className="muted" style={{ marginTop: 6 }}>{inst.note}</div>}
        </div>
      ))}

      <h3 style={{ margin: "20px 0 10px" }}>Interpretación integrada</h3>
      <textarea className="edit" style={{ minHeight: 160 }} value={d.summary} readOnly={readOnly} onChange={(e) => setD({ ...d, summary: e.target.value })} />

      <h3 style={{ margin: "20px 0 10px" }}>3 ejercicios prácticos sugeridos</h3>
      {d.exercises.map((ex, i) => (
        <div className="r-card" key={i}>
          <label>Título</label>
          <input className="edit" style={{ width: "100%", padding: 10, border: "1.5px solid var(--line)", borderRadius: 9, background: "var(--bg-panel)", color: "var(--ink)", fontFamily: "var(--sans)" }} value={ex.title} readOnly={readOnly} onChange={(e) => setExercise(i, "title", e.target.value)} />
          <label>Descripción</label>
          <textarea className="edit" value={ex.text} readOnly={readOnly} onChange={(e) => setExercise(i, "text", e.target.value)} />
        </div>
      ))}

      <h3 style={{ margin: "20px 0 10px" }}>Recomendaciones</h3>
      <textarea className="edit" style={{ minHeight: 120 }} value={d.recommendations} readOnly={readOnly} onChange={(e) => setD({ ...d, recommendations: e.target.value })} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Vista previa del correo</h3>
          <iframe title="Vista previa del informe" srcDoc={html} sandbox="" style={{ width: "100%", height: 720, border: "1px solid var(--line)", borderRadius: 12, background: "#fff" }} />
        </div>
      )}

      <div className="sticky-actions">
        <button className="btn btn-ghost" onClick={() => setPreview(!preview)}>{preview ? "Ocultar vista previa" : "Vista previa del correo"}</button>
        {!readOnly && (
          <>
            <button className="btn btn-ghost" onClick={onSave} disabled={pending}>Guardar borrador</button>
            <button className="btn btn-primary" onClick={onSend} disabled={pending}>{pending ? "Procesando…" : "Aprobar y enviar"}</button>
          </>
        )}
        {msg && <span className={msg.kind === "error" ? "error-msg" : "muted"} style={{ margin: 0 }}>{msg.text}</span>}
      </div>
    </div>
  );
}
