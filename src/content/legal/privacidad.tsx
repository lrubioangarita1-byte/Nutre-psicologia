/*
 * POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
 * Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013 (compilado en el Decreto Único 1074 de 2015).
 * Si se modifica sustancialmente, actualizar LEGAL_EFFECTIVE_DATE y CONSENT_VERSION.
 */
import { BRAND, LEGAL_EFFECTIVE_DATE } from "@/lib/brand";
import { ProviderIdentity } from "./common";

export function Privacidad() {
  return (
    <>
      <p className="meta">Vigente desde el {LEGAL_EFFECTIVE_DATE}.</p>
      <p>
        En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás
        normas concordantes, esta política regula la recolección, almacenamiento, uso, circulación, transmisión y supresión de los
        datos personales que se tratan a través de este sitio web.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ProviderIdentity />
      <p>La misma persona atiende las consultas y reclamos relacionados con datos personales, por los canales indicados.</p>

      <h2>2. Definiciones</h2>
      <p>
        Para efectos de esta política se aplican las definiciones del artículo 3 de la Ley 1581 de 2012. En particular: <b>titular</b>{" "}
        es la persona cuyos datos se tratan; <b>dato sensible</b> es aquel que afecta la intimidad del titular o cuyo uso indebido puede
        generar discriminación, incluidos los datos relativos a la salud; <b>encargado</b> es quien trata datos por cuenta del
        responsable; <b>transmisión</b> es la comunicación de datos a un encargado, dentro o fuera de Colombia.
      </p>

      <h2>3. Datos que se recolectan</h2>
      <ul>
        <li><b>Identificación y contacto:</b> nombre, correo electrónico, número de WhatsApp (opcional) y, si aplica, nombre del profesional que remite.</li>
        <li><b>Datos sensibles relativos a la salud:</b> respuestas a los cuestionarios psicológicos, puntajes calculados, respuesta a la pregunta de seguridad sobre ideas de autolesión e informe resultante.</li>
        <li><b>Datos de la transacción:</b> valor, moneda, estado e identificador del pago. Los datos de tarjetas y cuentas bancarias los recibe y procesa directamente la pasarela de pago (Wompi o Stripe); este sitio no los conoce ni los almacena.</li>
        <li><b>Registro de aceptación:</b> fecha y hora de aceptación de esta política, del consentimiento informado y de los términos, versión aceptada, y datos técnicos de la conexión (dirección IP y navegador) como prueba de la autorización.</li>
      </ul>
      <p>No se recolectan datos de menores de 18 años. Los servicios están dirigidos exclusivamente a personas adultas.</p>

      <h2>4. Datos sensibles</h2>
      <p>
        De conformidad con los artículos 5 y 6 de la Ley 1581 de 2012, el tratamiento de datos sensibles solo se realiza con
        autorización previa, expresa e informada del titular. <b>El titular no está obligado a autorizar el tratamiento de datos
        sensibles</b> ni a responder preguntas sobre ellos. Sin embargo, como el servicio consiste precisamente en evaluar
        respuestas psicológicas, sin esa autorización no es posible prestarlo. Ninguna actividad está condicionada a que el titular
        suministre datos sensibles más allá de los estrictamente necesarios para el servicio que contrata.
      </p>

      <h2>5. Finalidades del tratamiento</h2>
      <ol>
        <li>Habilitar el acceso a la evaluación adquirida, calcular los resultados y elaborar, revisar y enviar el informe personalizado.</li>
        <li>Activar el protocolo de riesgo cuando las respuestas sugieran riesgo para la vida o la integridad del titular, lo que incluye contactarlo por correo o WhatsApp y orientarlo hacia líneas de atención en crisis.</li>
        <li>Gestionar pagos, reembolsos, peticiones, quejas y reclamos.</li>
        <li>Enviar comunicaciones relacionadas exclusivamente con el servicio contratado (acceso, recordatorios y entrega del informe). No se envía publicidad sin autorización adicional.</li>
        <li>Cumplir obligaciones legales, deontológicas y de conservación de registros profesionales, y atender requerimientos de autoridades competentes.</li>
        <li>Elaborar estadísticas internas anonimizadas para mejorar el servicio, sin identificar a ningún titular.</li>
      </ol>
      <p>Los datos no se venden, alquilan ni ceden a terceros con fines comerciales.</p>

      <h2>6. Profesional remitente</h2>
      <p>
        Si el titular indica que fue remitido por un profesional, su nombre aparecerá en el informe. El informe se envía únicamente al
        correo del titular. Solo se compartirán resultados con el profesional remitente si el titular lo autoriza expresamente.
      </p>

      <h2>7. Encargados y transmisión internacional de datos</h2>
      <p>
        Para prestar el servicio se utilizan proveedores tecnológicos que actúan como encargados del tratamiento, bajo obligaciones de
        confidencialidad y seguridad: alojamiento web (Vercel Inc.), base de datos (Supabase Inc.), envío de correos (Resend) y
        pasarelas de pago (Wompi – Bancolombia S.A., y Stripe Inc.). Algunos de estos proveedores almacenan la información en
        servidores ubicados fuera de Colombia, principalmente en los Estados Unidos. Al aceptar esta política, el titular autoriza
        expresamente esa transmisión internacional, en los términos del artículo 26 de la Ley 1581 de 2012 y de las normas que lo
        reglamentan. Los encargados solo pueden tratar los datos para las finalidades aquí descritas.
      </p>

      <h2>8. Excepciones a la confidencialidad</h2>
      <p>
        Además de lo previsto en el secreto profesional del psicólogo (Ley 1090 de 2006), los datos podrán revelarse sin autorización
        del titular únicamente: (i) cuando exista riesgo grave para la vida o la integridad del titular o de terceros, en la medida
        necesaria para protegerlos; (ii) por orden de autoridad judicial o administrativa competente; y (iii) en los demás casos
        previstos en el artículo 10 de la Ley 1581 de 2012.
      </p>

      <h2>9. Derechos del titular</h2>
      <p>De acuerdo con el artículo 8 de la Ley 1581 de 2012, el titular tiene derecho a:</p>
      <ul>
        <li>Conocer, actualizar y rectificar sus datos personales.</li>
        <li>Solicitar prueba de la autorización otorgada.</li>
        <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), una vez agotado el trámite de consulta o reclamo ante el responsable.</li>
        <li>Revocar la autorización y/o solicitar la supresión de sus datos, salvo cuando exista un deber legal o contractual de conservarlos.</li>
        <li>Acceder en forma gratuita a sus datos personales.</li>
      </ul>

      <h2>10. Procedimiento para consultas y reclamos</h2>
      <p>
        Las solicitudes se presentan por correo a <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>, indicando nombre, correo con
        el que se realizó la evaluación, descripción de la solicitud y, para reclamos, los documentos que se quieran hacer valer. Se
        podrá verificar la identidad del solicitante antes de entregar información.
      </p>
      <ul>
        <li><b>Consultas:</b> se responden en un máximo de diez (10) días hábiles desde su recibo, prorrogables por cinco (5) días hábiles más, informando el motivo de la demora (art. 14, Ley 1581 de 2012).</li>
        <li><b>Reclamos</b> (corrección, actualización, supresión o incumplimiento): si el reclamo está incompleto, se pedirá completarlo dentro de los cinco (5) días siguientes; si pasan dos (2) meses sin respuesta del titular, se entenderá desistido. El término máximo de respuesta es de quince (15) días hábiles, prorrogables por ocho (8) días hábiles más, informando el motivo (art. 15, Ley 1581 de 2012).</li>
      </ul>

      <h2>11. Conservación de la información</h2>
      <p>
        Los datos de contacto y transacción se conservan mientras sean necesarios para las finalidades descritas y para atender
        obligaciones contables, tributarias y de protección al consumidor. Las respuestas, puntajes, informes y registros del
        protocolo de riesgo constituyen registros profesionales del ejercicio de la psicología y se conservan durante el término
        exigido por las normas aplicables a la custodia de este tipo de registros. Cumplido ese término, se suprimen o anonimizan de
        forma segura. Mientras exista ese deber legal de conservación, la supresión no procede, pero el titular puede solicitar que
        sus datos se bloqueen para cualquier uso distinto de su conservación.
      </p>

      <h2>12. Seguridad</h2>
      <p>
        Se aplican medidas técnicas, humanas y administrativas razonables para proteger la información frente a adulteración,
        pérdida, consulta, uso o acceso no autorizado o fraudulento. Entre ellas: conexión cifrada (HTTPS), acceso a la base de datos
        restringido al servidor de la aplicación, panel de administración con autenticación, enlace de acceso personal y de difícil
        adivinación para cada evaluación, y registro inalterable de los eventos de riesgo. Ningún sistema es completamente
        invulnerable. Ante un incidente de seguridad se informará a la SIC y a los titulares afectados, conforme a la ley.
      </p>

      <h2>13. Responsabilidad del titular</h2>
      <p>
        El enlace de acceso a cada evaluación es personal. El titular se compromete a no compartirlo y a suministrar datos veraces.
        Si suministra datos de terceros, como el nombre del profesional remitente, declara contar con la autorización para hacerlo.
      </p>

      <h2>14. Vigencia y modificaciones</h2>
      <p>
        Esta política rige desde el {LEGAL_EFFECTIVE_DATE}. Las bases de datos estarán vigentes mientras se preste el servicio y
        durante los términos de conservación señalados. Cualquier cambio sustancial se informará en este sitio y, cuando afecte las
        finalidades del tratamiento, se solicitará una nueva autorización.
      </p>
    </>
  );
}
