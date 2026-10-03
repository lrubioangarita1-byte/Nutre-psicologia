/* POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES (Ley 1581 de 2012) — reemplazar por la versión final redactada por Laura. */
import { BRAND } from "@/lib/brand";

export function Privacidad() {
  return (
    <>
      <h2>1. Responsable del tratamiento</h2>
      <p>{BRAND.fullName}, Psicóloga, Tarjeta Profesional {BRAND.tp}. Correo: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.</p>
      <h2>2. Datos que se recolectan</h2>
      <p>Nombre, correo electrónico, número de WhatsApp (opcional), nombre del profesional remitente (opcional), respuestas a los cuestionarios, puntajes calculados, respuesta a la pregunta de seguridad y datos de la transacción de pago (no se almacenan datos de tarjetas; los procesa la pasarela).</p>
      <h2>3. Datos sensibles</h2>
      <p>Las respuestas a pruebas psicológicas son datos sensibles relativos a la salud. Su suministro es facultativo y su tratamiento requiere tu autorización expresa, que otorgas al aceptar esta política antes del pago.</p>
      <h2>4. Finalidades</h2>
      <ul>
        <li>Calcular resultados y elaborar tu informe personalizado.</li>
        <li>Enviarte el informe y comunicaciones relacionadas con tu evaluación.</li>
        <li>Activar el protocolo de riesgo cuando tus respuestas lo indiquen.</li>
        <li>Cumplir obligaciones legales y de custodia de la información.</li>
      </ul>
      <h2>5. Encargados</h2>
      <p>La información se almacena con proveedores tecnológicos que actúan como encargados (alojamiento y base de datos, envío de correos y pasarelas de pago), bajo deberes de confidencialidad y seguridad.</p>
      <h2>6. Derechos del titular</h2>
      <p>Puedes conocer, actualizar, rectificar y suprimir tus datos, revocar la autorización y presentar quejas ante la Superintendencia de Industria y Comercio. Para ejercerlos escribe a {BRAND.email}; se responderá en los plazos de ley.</p>
      <h2>7. Vigencia</h2>
      <p>Los datos se conservarán durante el tiempo necesario para las finalidades descritas y los plazos de custodia aplicables.</p>
    </>
  );
}
