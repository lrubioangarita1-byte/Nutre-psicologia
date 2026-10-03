"use client";

import { useActionState, useState } from "react";
import { createCourtesyEvaluation } from "../actions";

type Option = { id: string; name: string };

export function CourtesyForm({ packs, defaultEmail }: { packs: Option[]; defaultEmail: string }) {
  const [state, action, pending] = useActionState(createCourtesyEvaluation, undefined);
  const [copied, setCopied] = useState(false);

  return (
    <details className="card">
      <summary style={{ cursor: "pointer", fontWeight: 700 }}>Crear evaluación sin pago (prueba o cortesía)</summary>
      <p className="muted" style={{ margin: "8px 0 14px" }}>
        Genera un acceso real, como si la persona hubiera pagado. Le llega el enlace por correo (si los correos están conectados) y su
        caso aparece aquí para que lo revises y envíes el informe. Para probar todo el recorrido, usa tu propio correo.
      </p>
      <form action={action}>
        <div className="field">
          <label htmlFor="c-pack">Pack</label>
          <select id="c-pack" name="packId" required defaultValue="">
            <option value="" disabled>Elige un pack…</option>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="c-nombre">Nombre</label><input id="c-nombre" name="nombre" required defaultValue="Laura (prueba)" /></div>
        <div className="field"><label htmlFor="c-correo">Correo</label><input id="c-correo" name="correo" type="email" required defaultValue={defaultEmail} /></div>
        <div className="field"><label htmlFor="c-wa">WhatsApp (opcional)</label><input id="c-wa" name="whatsapp" type="tel" /></div>
        <div className="field"><label htmlFor="c-ref">Remitido por (opcional)</label><input id="c-ref" name="remitidoPor" /></div>
        {state?.error && <div className="error-msg" role="alert">{state.error}</div>}
        <button className="btn btn-primary" disabled={pending}>{pending ? "Creando…" : "Crear acceso"}</button>
      </form>
      {state?.url && (
        <div className="safety-note" style={{ marginTop: 16, flexDirection: "column" }}>
          <b>Acceso creado.</b>
          <span style={{ overflowWrap: "anywhere" }}>{state.url}</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a className="btn btn-primary" href={state.url} target="_blank" rel="noopener">Abrir la evaluación</a>
            <button type="button" className="btn btn-ghost" onClick={() => { navigator.clipboard?.writeText(state.url!); setCopied(true); }}>
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </button>
          </div>
        </div>
      )}
    </details>
  );
}
