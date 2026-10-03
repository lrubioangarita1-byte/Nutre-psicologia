/*
 * CONSENTIMIENTO INFORMADO DIGITAL
 * Reemplazar el contenido por la versión final redactada por Laura (manteniendo la estructura JSX).
 * Si cambia el texto, actualizar CONSENT_VERSION en src/lib/submissions.ts.
 */
import { BRAND } from "@/lib/brand";

/** Resumen que se muestra en el checkout, antes de pagar. */
export function ConsentSummary() {
  return (
    <>
      <p><b>Qué es esto:</b> un tamizaje orientativo, no un diagnóstico clínico definitivo ni una terapia. Recibirás un informe personalizado por correo en 12–24 horas, elaborado y aprobado por {BRAND.fullName}, Psicóloga, Tarjeta Profesional {BRAND.tp}.</p>
      <p><b>Confidencialidad:</b> tus respuestas son confidenciales. Solo se comparten si se identifica riesgo para tu vida o la de un tercero, o por requerimiento legal.</p>
      <p><b>Uso previsto:</b> este pack está pensado para autoconocimiento o para usarse con acompañamiento profesional. Si los resultados sugieren riesgo, se te recomendará buscar apoyo adicional.</p>
      <p><b>No sustituye atención de urgencia.</b> Si estás en crisis ahora mismo, llama a la {BRAND.crisisLine}, en vez de esperar tu informe.</p>
    </>
  );
}

/** Addendum específico para packs clínicos (tamizaje). */
export function ClinicalAddendum() {
  return (
    <>
      <p><b>Addendum — packs de tamizaje clínico:</b> este pack incluye una pregunta de seguridad sobre pensamientos de hacerte daño. Si respondes afirmativamente, verás de inmediato información de líneas de crisis y la psicóloga recibirá una alerta para intentar contactarte por los datos que registraste (correo y WhatsApp). Esta plataforma no presta atención de crisis en tiempo real.</p>
      <p>Los resultados de tamizaje (ansiedad, conducta alimentaria, TDAH, etc.) indican la conveniencia de una evaluación adicional, nunca un diagnóstico.</p>
    </>
  );
}

export function ConsentFull() {
  return (
    <>
      <h2>1. Naturaleza del servicio</h2>
      <p>El servicio consiste en la aplicación autoadministrada, en línea, de instrumentos psicométricos de tamizaje y autoconocimiento, y la entrega de un informe escrito revisado y aprobado por {BRAND.fullName}, Psicóloga, Tarjeta Profesional {BRAND.tp}. No constituye psicoterapia, diagnóstico clínico definitivo ni atención de urgencias.</p>
      <h2>2. Procedimiento</h2>
      <p>Tras el pago, respondes los cuestionarios del pack elegido. Tus respuestas se guardan de forma automática y segura. Al finalizar verás una lectura preliminar automática; el informe completo llega a tu correo en un plazo de 12 a 24 horas.</p>
      <h2>3. Beneficios y limitaciones</h2>
      <p>Los resultados pueden ayudarte a conocerte mejor y a decidir si conviene buscar una evaluación o acompañamiento profesional. Los instrumentos de tamizaje tienen márgenes de error y su interpretación depende de la sinceridad de las respuestas y del contexto, que una prueba en línea no captura por completo.</p>
      <h2>4. Confidencialidad y secreto profesional</h2>
      <p>La información se maneja bajo secreto profesional (Ley 1090 de 2006) y conforme a la Política de Tratamiento de Datos Personales. Solo podrá compartirse sin tu autorización cuando exista riesgo para tu vida o la de terceros, o por orden de autoridad competente.</p>
      <h2>5. Protocolo de riesgo</h2>
      <ClinicalAddendum />
      <h2>6. Requisitos</h2>
      <p>Debes ser mayor de 18 años. Si el pack fue remitido por un profesional, su nombre aparecerá como remitente en el informe.</p>
      <h2>7. Voluntariedad</h2>
      <p>Tu participación es voluntaria. Puedes dejar de responder en cualquier momento.</p>
      <h2>8. Contacto</h2>
      <p>Para dudas sobre este consentimiento: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.</p>
    </>
  );
}
