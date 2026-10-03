"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  packId: string;
  clinical: boolean;
  priceUsd: number;
  priceCop: number;
  providers: { wompi: boolean; stripe: boolean; bypass: boolean };
};

export function CheckoutForm({ packId, clinical, priceUsd, priceCop, providers }: Props) {
  const firstProvider = providers.wompi ? "wompi" : providers.stripe ? "stripe" : providers.bypass ? "prueba" : "";
  const [proveedor, setProveedor] = useState(firstProvider);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const payload = {
      packId,
      proveedor,
      nombre: f.get("nombre"),
      correo: f.get("correo"),
      whatsapp: f.get("whatsapp"),
      remitidoPor: f.get("remitidoPor"),
      consentimiento: f.get("consentimiento") === "on",
      tratamientoDatos: f.get("tratamientoDatos") === "on",
      datosSensibles: f.get("datosSensibles") === "on",
      mayorDeEdad: f.get("mayorDeEdad") === "on",
      addendumClinico: !clinical || f.get("addendumClinico") === "on",
    };
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error || "No pudimos iniciar el pago.");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar el pago.");
      setLoading(false);
    }
  }

  if (!firstProvider) {
    return <div className="error-msg">Los pagos en línea aún no están habilitados. Escríbenos para comprar este pack.</div>;
  }

  return (
    <form onSubmit={onSubmit}>
      <label className="consent-check">
        <input type="checkbox" name="consentimiento" required />
        <span>He leído y acepto el <Link href="/legal/consentimiento" target="_blank">consentimiento informado</Link> y los <Link href="/legal/terminos" target="_blank">términos y condiciones</Link>. Entiendo que el servicio empieza a ejecutarse cuando respondo la primera pregunta, y que desde ese momento no aplica el derecho de retracto.</span>
      </label>
      {clinical && (
        <label className="consent-check">
          <input type="checkbox" name="addendumClinico" required />
          <span>Acepto el addendum para packs de tamizaje clínico, incluido el protocolo de riesgo.</span>
        </label>
      )}
      <label className="consent-check">
        <input type="checkbox" name="tratamientoDatos" required />
        <span>Autorizo el tratamiento de mis datos personales según la <Link href="/legal/privacidad" target="_blank">Política de Tratamiento de Datos</Link> (Ley 1581 de 2012), incluida su transmisión a proveedores tecnológicos con servidores fuera de Colombia.</span>
      </label>
      <label className="consent-check">
        <input type="checkbox" name="datosSensibles" required />
        <span>Autorizo de forma expresa el tratamiento de mis <b>datos sensibles de salud</b> (respuestas, resultados e informe) para las finalidades de la política. Sé que no estoy obligado/a a autorizarlo, pero que sin esa autorización no es posible prestar el servicio.</span>
      </label>
      <label className="consent-check">
        <input type="checkbox" name="mayorDeEdad" required />
        <span>Soy mayor de 18 años.</span>
      </label>

      <h2 style={{ fontSize: 22, margin: "28px 0 12px" }}>Tus datos</h2>
      <div className="field">
        <label htmlFor="nombre">Nombre completo</label>
        <input id="nombre" name="nombre" required minLength={2} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="correo">Correo electrónico</label>
        <input id="correo" name="correo" type="email" required autoComplete="email" />
        <div className="hint">Aquí te llegan el enlace de acceso y tu informe.</div>
      </div>
      <div className="field">
        <label htmlFor="whatsapp">WhatsApp (con indicativo, ej. 57300…)</label>
        <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" />
        <div className="hint">Opcional. Solo se usa para contactarte si tus respuestas indican riesgo.</div>
      </div>
      <div className="field">
        <label htmlFor="remitidoPor">Remitido por (opcional)</label>
        <input id="remitidoPor" name="remitidoPor" placeholder="Nombre de tu psicólogo/a, si te remitió" />
      </div>

      <h2 style={{ fontSize: 22, margin: "28px 0 12px" }}>Medio de pago</h2>
      <div className="pay-options">
        {providers.wompi && (
          <label className="pay-option">
            <input type="radio" name="proveedor" checked={proveedor === "wompi"} onChange={() => setProveedor("wompi")} />
            <span><b>${priceCop.toLocaleString("es-CO")} COP</b>Wompi: PSE, Nequi, tarjetas y más (Colombia)</span>
          </label>
        )}
        {providers.stripe && (
          <label className="pay-option">
            <input type="radio" name="proveedor" checked={proveedor === "stripe"} onChange={() => setProveedor("stripe")} />
            <span><b>${priceUsd} USD</b>Tarjeta internacional (Stripe)</span>
          </label>
        )}
        {providers.bypass && (
          <label className="pay-option">
            <input type="radio" name="proveedor" checked={proveedor === "prueba"} onChange={() => setProveedor("prueba")} />
            <span><b>Modo prueba</b>Solo desarrollo — no cobra</span>
          </label>
        )}
      </div>

      {error && <div className="error-msg" role="alert">{error}</div>}
      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Redirigiendo al pago…" : "Pagar y comenzar"}
      </button>
    </form>
  );
}
