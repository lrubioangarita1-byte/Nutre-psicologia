/*
 * TÉRMINOS Y CONDICIONES
 * Marco: Ley 1480 de 2011 (Estatuto del Consumidor; arts. 47, 50 y 51 sobre comercio electrónico, retracto y reversión),
 * Ley 527 de 1999 (comercio electrónico), Ley 1090 de 2006 y Ley 1581 de 2012.
 */
import Link from "next/link";
import { BRAND, LEGAL_EFFECTIVE_DATE } from "@/lib/brand";
import { ProviderIdentity } from "./common";

export function Terminos() {
  return (
    <>
      <p className="meta">Vigentes desde el {LEGAL_EFFECTIVE_DATE}.</p>

      <h2>1. Identificación del prestador</h2>
      <ProviderIdentity />

      <h2>2. Objeto y aceptación</h2>
      <p>
        Estos Términos regulan el uso del sitio y la compra de evaluaciones psicológicas en línea (&quot;packs&quot; y &quot;pruebas
        sueltas&quot;). Al marcar la casilla de aceptación y realizar el pago, celebras un contrato de prestación de servicios con el
        prestador, por medios electrónicos válidos conforme a la Ley 527 de 1999. Forman parte de este contrato el{" "}
        <Link href="/legal/consentimiento">Consentimiento Informado</Link> y la{" "}
        <Link href="/legal/privacidad">Política de Tratamiento de Datos Personales</Link>.
      </p>

      <h2>3. Descripción del servicio</h2>
      <p>Cada pack o prueba suelta incluye:</p>
      <ul>
        <li>acceso en línea, mediante un enlace personal, a los instrumentos descritos en la ficha del producto;</li>
        <li>una lectura preliminar automática al finalizar;</li>
        <li>un informe personalizado revisado y aprobado por la psicóloga, enviado al correo registrado en un plazo de 12 a 24 horas después de completar todas las pruebas.</li>
      </ul>
      <p>
        El servicio es una evaluación puntual y orientativa. No incluye psicoterapia, sesiones, seguimiento, diagnóstico clínico
        definitivo, certificados para fines legales o laborales, ni atención de urgencias. Los resultados no deben usarse como única
        base para decisiones clínicas, laborales, legales o académicas.
      </p>

      <h2>4. Requisitos</h2>
      <p>
        El servicio está dirigido exclusivamente a personas mayores de 18 años que lo contratan para sí mismas. El usuario declara
        que los datos suministrados son veraces. Los servicios para empresas (selección de personal) se contratan por separado,
        mediante contacto directo.
      </p>

      <h2>5. Precio y pago</h2>
      <ul>
        <li>El precio de cada producto se informa en su ficha, en dólares estadounidenses (USD) y en pesos colombianos (COP). Es el precio total a pagar e incluye los impuestos aplicables.</li>
        <li>Los pagos en COP se procesan con Wompi y los pagos en USD con Stripe. Tu banco o emisor puede cobrar comisiones o diferencias de cambio que son ajenas al prestador.</li>
        <li>El acceso a las pruebas se habilita cuando la pasarela confirma el pago. Recibirás por correo la confirmación y el enlace de acceso.</li>
        <li>El prestador no recibe ni almacena datos de tarjetas o cuentas bancarias.</li>
      </ul>

      <h2>6. Derecho de retracto</h2>
      <p>
        Por tratarse de una venta a distancia, tienes derecho de retracto dentro de los cinco (5) días hábiles siguientes a la compra
        (art. 47, Ley 1480 de 2011), <b>siempre que no hayas comenzado a responder las pruebas</b>. De acuerdo con la misma norma, el
        retracto no aplica a los contratos de prestación de servicios cuya ejecución haya comenzado con el acuerdo del consumidor. Al
        iniciar la primera prueba aceptas expresamente que el servicio comienza a ejecutarse. Para ejercer el retracto, escribe a{" "}
        {BRAND.email} indicando el correo con el que compraste. El reembolso se hará por el mismo medio de pago, dentro de los treinta
        (30) días calendario siguientes.
      </p>

      <h2>7. Reversión del pago</h2>
      <p>
        Puedes solicitar la reversión del pago en los casos del artículo 51 de la Ley 1480 de 2011 (fraude, operación no solicitada,
        producto no recibido o que no corresponda a lo solicitado), presentando la queja al prestador y la solicitud de reversión al
        emisor de tu medio de pago, dentro de los cinco (5) días hábiles siguientes a la fecha en que conociste la situación.
      </p>

      <h2>8. Incumplimiento en la entrega</h2>
      <p>
        Si completaste todas las pruebas y no recibes tu informe dentro de las 72 horas siguientes, y no se te informó una causa
        justificada, puedes pedir la entrega inmediata o el reembolso total escribiendo a {BRAND.email}. Revisa también tu carpeta de
        correo no deseado.
      </p>

      <h2>9. Obligaciones del usuario</h2>
      <ul>
        <li>Responder con sinceridad y por sí mismo/a.</li>
        <li>No compartir su enlace personal de acceso. El prestador no responde por el acceso de terceros a quienes el usuario haya entregado su enlace.</li>
        <li>Mantener vigentes sus datos de contacto, indispensables para la entrega del informe y para el protocolo de riesgo.</li>
        <li>No copiar, reproducir, distribuir ni comercializar los cuestionarios, informes ni contenidos del sitio.</li>
      </ul>

      <h2>10. Protocolo de riesgo y atención de urgencias</h2>
      <p>
        La plataforma no presta atención de urgencias ni de crisis en tiempo real. Si las respuestas sugieren riesgo, se mostrará
        información de líneas de crisis y la psicóloga intentará contactar al usuario, como se describe en el Consentimiento
        Informado. Ese contacto es una medida de cuidado razonable y no garantiza una intervención inmediata. Ante cualquier
        emergencia, el usuario debe comunicarse con la {BRAND.crisisLine}, la línea 123 o el servicio de urgencias más cercano.
      </p>

      <h2>11. Alcance de la responsabilidad</h2>
      <p>
        El prestador responde por prestar el servicio con la diligencia profesional exigida por la Ley 1090 de 2006 y por la
        calidad, idoneidad y seguridad que exige la Ley 1480 de 2011. Como se trata de un servicio orientativo basado en
        información autorreportada, el prestador no responde por las decisiones que el usuario tome únicamente con base en los
        resultados, ni por inexactitudes que provengan de respuestas falsas o incompletas. Nada de lo previsto aquí limita los
        derechos irrenunciables del consumidor ni la responsabilidad que la ley no permite excluir.
      </p>

      <h2>12. Propiedad intelectual</h2>
      <p>
        Los textos, diseño, marca, informes y software del sitio pertenecen al prestador o se usan con licencia. Los instrumentos
        psicométricos pertenecen a sus respectivos autores y se usan conforme a sus condiciones de uso. El informe es para uso
        personal del usuario.
      </p>

      <h2>13. Peticiones, quejas y reclamos (PQR)</h2>
      <p>
        Puedes presentar peticiones, quejas o reclamos al correo {BRAND.email}. Se responderán en un término máximo de quince (15)
        días hábiles. Si la respuesta no te satisface, puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co).
        Las quejas sobre el ejercicio profesional pueden presentarse ante el Colegio Colombiano de Psicólogos y sus tribunales
        deontológicos.
      </p>

      <h2>14. Modificaciones</h2>
      <p>
        El prestador puede actualizar estos Términos. La versión aplicable a cada compra es la vigente en la fecha de pago, que queda
        registrada.
      </p>

      <h2>15. Ley aplicable</h2>
      <p>Estos Términos se rigen por las leyes de la República de Colombia.</p>
    </>
  );
}
