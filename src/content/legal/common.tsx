import { BRAND } from "@/lib/brand";

/** Identificación del prestador / responsable del tratamiento. */
export function ProviderIdentity() {
  return (
    <ul>
      <li><b>Nombre:</b> {BRAND.fullName}, Psicóloga, Tarjeta Profesional n.º {BRAND.tp}.</li>
      {BRAND.documento && <li><b>Documento de identificación:</b> {BRAND.documento}</li>}
      {(BRAND.domicilio || BRAND.ciudad) && (
        <li><b>Domicilio y dirección de notificación:</b> {[BRAND.domicilio, BRAND.ciudad].filter(Boolean).join(", ")}</li>
      )}
      <li><b>Correo electrónico:</b> <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
      <li><b>Teléfono / WhatsApp:</b> {BRAND.telefono}</li>
    </ul>
  );
}
