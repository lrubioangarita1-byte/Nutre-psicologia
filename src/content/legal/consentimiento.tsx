/*
 * CONSENTIMIENTO INFORMADO DIGITAL (+ addendum para packs de tamizaje clínico)
 * Marco: Ley 1090 de 2006 (Código Deontológico y Bioético del Psicólogo), Ley 1616 de 2013 (salud mental),
 * Ley 527 de 1999 (validez de los mensajes de datos) y Ley 1581 de 2012.
 * Si cambia el texto, actualizar CONSENT_VERSION en src/lib/submissions.ts.
 */
import Link from "next/link";
import { BRAND, LEGAL_EFFECTIVE_DATE } from "@/lib/brand";

/** Resumen que se muestra en el checkout, antes de pagar. */
export function ConsentSummary() {
  return (
    <>
      <p><b>Qué es esto:</b> una evaluación psicológica orientativa (tamizaje y autoconocimiento), autoaplicada en línea. <b>No es un diagnóstico clínico definitivo, ni psicoterapia, ni atención de urgencias.</b> Recibirás un informe personalizado por correo en 12–24 horas, revisado y aprobado por {BRAND.fullName}, Psicóloga, Tarjeta Profesional {BRAND.tp}.</p>
      <p><b>Confidencialidad:</b> tus respuestas están protegidas por el secreto profesional. Solo se comparten sin tu autorización si hay riesgo grave para tu vida o la de un tercero, o por orden de una autoridad competente.</p>
      <p><b>Límites:</b> los resultados dependen de la sinceridad de tus respuestas y no reemplazan una evaluación presencial completa. Si sugieren riesgo, se te recomendará buscar apoyo profesional.</p>
      <p><b>No sustituye atención de urgencia.</b> Si estás en crisis ahora mismo, llama a la {BRAND.crisisLine} o acude al servicio de urgencias más cercano, en vez de esperar tu informe.</p>
      <p>Puedes leer el <Link href="/legal/consentimiento" target="_blank">consentimiento informado completo</Link> antes de aceptar.</p>
    </>
  );
}

/** Addendum específico para packs clínicos (tamizaje). */
export function ClinicalAddendum() {
  return (
    <>
      <p><b>Addendum — packs de tamizaje clínico:</b> este pack incluye una pregunta de seguridad sobre pensamientos de hacerte daño o de que la vida no vale la pena. Si respondes &quot;Sí&quot;: (1) verás de inmediato información de líneas de atención en crisis; (2) la psicóloga recibirá una alerta automática e intentará contactarte por el correo y el WhatsApp que registraste; y (3) quedará un registro con fecha y hora de este evento. Autorizas ese contacto. Esta plataforma <b>no presta atención de crisis en tiempo real</b>: si estás en peligro, no esperes ese contacto.</p>
      <p>Los resultados de tamizaje (ansiedad, conducta alimentaria, atención/TDAH, entre otros) indican si conviene una evaluación adicional. <b>Nunca constituyen un diagnóstico.</b></p>
    </>
  );
}

export function ConsentFull() {
  return (
    <>
      <p className="meta">Versión vigente desde el {LEGAL_EFFECTIVE_DATE}.</p>
      <p>
        Este documento cumple el deber de obtener el consentimiento informado previsto en la Ley 1090 de 2006 (Código Deontológico y
        Bioético del Psicólogo). Se acepta por medios electrónicos, con plena validez conforme a la Ley 527 de 1999. La aceptación
        queda registrada con fecha, hora y versión del documento.
      </p>

      <h2>1. Profesional responsable</h2>
      <p>
        {BRAND.fullName}, Psicóloga, Tarjeta Profesional n.º {BRAND.tp}, es responsable de la revisión, interpretación y aprobación
        de cada informe. Contacto: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
      </p>

      <h2>2. Naturaleza y objetivo del servicio</h2>
      <p>
        El servicio consiste en la aplicación autoadministrada, en línea, de instrumentos psicométricos de tamizaje y autoconocimiento,
        y en la entrega de un informe escrito. Su objetivo es orientar al usuario sobre su funcionamiento emocional, rasgos o
        síntomas, y sobre la conveniencia de buscar una evaluación o acompañamiento adicional.
      </p>
      <p>El servicio <b>no</b> es:</p>
      <ul>
        <li>un diagnóstico clínico definitivo;</li>
        <li>psicoterapia ni un proceso de acompañamiento continuo;</li>
        <li>atención de urgencias o de crisis en tiempo real;</li>
        <li>un sustituto de la valoración médica o psiquiátrica, ni una prescripción de tratamiento farmacológico.</li>
      </ul>

      <h2>3. Procedimiento</h2>
      <ol>
        <li>Lees y aceptas este consentimiento, los Términos y Condiciones y la Política de Tratamiento de Datos, y pagas el servicio.</li>
        <li>Respondes los cuestionarios del pack elegido a tu ritmo. Tus respuestas se guardan automáticamente.</li>
        <li>Al terminar ves una lectura preliminar automática, que es solo orientativa.</li>
        <li>La psicóloga revisa tus resultados y aprueba un informe personalizado, que recibirás por correo en un plazo de 12 a 24 horas. Ese plazo puede extenderse en casos excepcionales, lo que se te informará.</li>
      </ol>

      <h2>4. Instrumentos utilizados</h2>
      <p>
        Se usan instrumentos de tamizaje y de evaluación de rasgos de uso reconocido en psicología (por ejemplo GAD-7, PSS-10, TMMS-24,
        EAT-26, SCOFF, IPIP-50, Escala de Rosenberg, ASRS v1.1 y WURS-25), según el pack. La prueba breve de atención incluida en
        algunos packs es un ejercicio ilustrativo, no una prueba neuropsicológica validada. Los puntos de corte son orientativos y
        pueden no estar validados para todas las poblaciones.
      </p>

      <h2>5. Beneficios, riesgos y limitaciones</h2>
      <p>
        <b>Beneficios:</b> mayor conocimiento de ti mismo/a e información útil para decidir si buscar apoyo profesional.{" "}
        <b>Riesgos:</b> responder preguntas sobre emociones, conductas o recuerdos puede generar malestar pasajero, y un resultado puede
        sorprenderte o preocuparte. Puedes detenerte en cualquier momento y retomar después con tu enlace.{" "}
        <b>Limitaciones:</b> una evaluación autoaplicada en línea no permite observar tu conducta, explorar tu historia ni verificar tus
        respuestas como lo haría una evaluación presencial. Por eso los resultados no deben usarse como única base para decisiones
        clínicas, laborales, legales o académicas.
      </p>

      <h2>6. Confidencialidad y secreto profesional</h2>
      <p>
        La información se maneja bajo el secreto profesional que establece la Ley 1090 de 2006, y conforme a la{" "}
        <Link href="/legal/privacidad">Política de Tratamiento de Datos Personales</Link>. Solo podrá revelarse sin tu autorización
        cuando exista riesgo grave para tu vida o integridad o la de terceros, en la medida necesaria para protegerlas, o por orden de
        autoridad competente. El informe se envía solo a tu correo. Si te remitió un profesional, solo se le compartirán resultados
        con tu autorización expresa.
      </p>

      <h2>7. Protocolo de riesgo</h2>
      <ClinicalAddendum />
      <p>
        Además, si tus puntajes superan los umbrales de riesgo de algún instrumento, la psicóloga recibirá una notificación prioritaria
        y el informe te recomendará buscar apoyo profesional pronto.
      </p>

      <h2>8. Requisitos y declaraciones del usuario</h2>
      <ul>
        <li>Declaras ser mayor de 18 años y actuar en tu propio nombre.</li>
        <li>Te comprometes a responder con sinceridad y a suministrar datos de contacto veraces y vigentes, necesarios para el protocolo de riesgo y la entrega del informe.</li>
        <li>Entiendes que, si estás en tratamiento psicológico o psiquiátrico, este servicio no lo reemplaza, y que conviene compartir el informe con tu profesional tratante.</li>
      </ul>

      <h2>9. Voluntariedad y revocación</h2>
      <p>
        Tu participación es voluntaria. Puedes dejar de responder en cualquier momento y revocar este consentimiento escribiendo a{" "}
        {BRAND.email}. La revocación no afecta el tratamiento realizado antes de ella, ni la conservación de registros exigida por
        la ley. Las condiciones de reembolso se rigen por los Términos y Condiciones.
      </p>

      <h2>10. Constancia de aceptación</h2>
      <p>
        Al marcar las casillas de aceptación y continuar con el pago, declaras que leíste y entendiste este documento, que tuviste la
        oportunidad de resolver tus dudas escribiendo al correo indicado, y que consientes de manera libre, previa, expresa e informada.
      </p>
    </>
  );
}
