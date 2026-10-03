"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

/** Pantalla de consentimiento para evaluaciones creadas desde el panel (cortesía). */
export function ConsentGate({ token, clientName, packName, clinical, children }: {
  token: string;
  clientName: string;
  packName: string;
  clinical: boolean;
  children: React.ReactNode;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const res = await fetch(`/api/evaluacion/${token}/consentimiento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consentimiento: f.get("consentimiento") === "on",
        addendumClinico: !clinical || f.get("addendumClinico") === "on",
        tratamientoDatos: f.get("tratamientoDatos") === "on",
        datosSensibles: f.get("datosSensibles") === "on",
        mayorDeEdad: f.get("mayorDeEdad") === "on",
      }),
    }).catch(() => null);
    if (res?.ok) {
      window.location.reload();
      return;
    }
    setError("No pudimos guardar tu aceptación. Revisa tu conexión e intenta de nuevo.");
    setBusy(false);
  }

  return (
    <div>
      <div className="app-bar">
        <span className="brand-mini"><span className="mono">{BRAND.monogram}</span> {BRAND.product}</span>
        <span className="step-label">Antes de empezar</span>
      </div>
      <div className="app-body">
        <div className="app-h">Hola {clientName.split(" ")[0]}</div>
        <div className="app-sub">{BRAND.fullName} te invitó a responder el pack <b>{packName}</b>. Antes de empezar, lee y acepta lo siguiente.</div>
        <div className="consent-box">{children}</div>
        <form onSubmit={onSubmit}>
          <label className="consent-check"><input type="checkbox" name="consentimiento" required /><span>He leído y acepto el <Link href="/legal/consentimiento" target="_blank">consentimiento informado</Link> y los <Link href="/legal/terminos" target="_blank">términos y condiciones</Link>.</span></label>
          {clinical && <label className="consent-check"><input type="checkbox" name="addendumClinico" required /><span>Acepto el addendum para packs de tamizaje clínico, incluido el protocolo de riesgo.</span></label>}
          <label className="consent-check"><input type="checkbox" name="tratamientoDatos" required /><span>Autorizo el tratamiento de mis datos personales según la <Link href="/legal/privacidad" target="_blank">Política de Tratamiento de Datos</Link> (Ley 1581 de 2012), incluida su transmisión a proveedores tecnológicos con servidores fuera de Colombia.</span></label>
          <label className="consent-check"><input type="checkbox" name="datosSensibles" required /><span>Autorizo de forma expresa el tratamiento de mis <b>datos sensibles de salud</b> (respuestas, resultados e informe). Sé que no estoy obligado/a a autorizarlo, pero que sin esa autorización no es posible prestar el servicio.</span></label>
          <label className="consent-check"><input type="checkbox" name="mayorDeEdad" required /><span>Soy mayor de 18 años.</span></label>
          {error && <div className="error-msg" role="alert">{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={busy}>{busy ? "Guardando…" : "Aceptar y comenzar"}</button>
        </form>
      </div>
    </div>
  );
}
