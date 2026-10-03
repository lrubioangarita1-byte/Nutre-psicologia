/* TÉRMINOS Y CONDICIONES — reemplazar por la versión final redactada por Laura. */
import { BRAND } from "@/lib/brand";

export function Terminos() {
  return (
    <>
      <h2>1. Objeto</h2>
      <p>Estos términos regulan el uso del sitio y la compra de evaluaciones psicológicas en línea ofrecidas por {BRAND.fullName}, Psicóloga, Tarjeta Profesional {BRAND.tp}.</p>
      <h2>2. Servicio</h2>
      <p>Cada pack incluye la aplicación en línea de los instrumentos descritos en su ficha y un informe personalizado enviado por correo electrónico en un plazo de 12 a 24 horas tras completar las pruebas. Los resultados son orientativos y no constituyen diagnóstico clínico definitivo.</p>
      <h2>3. Precios y pagos</h2>
      <p>Los precios se muestran en dólares estadounidenses (USD) y su equivalente en pesos colombianos (COP) para pagos con Wompi. El acceso a las pruebas se habilita cuando el pago es aprobado por la pasarela.</p>
      <h2>4. Retracto y reembolsos</h2>
      <p>Por tratarse de un servicio que se ejecuta de inmediato con el consentimiento del usuario, una vez iniciadas las pruebas no procede el derecho de retracto. Si pagaste y no has iniciado las pruebas, puedes solicitar el reembolso escribiendo a {BRAND.email}.</p>
      <h2>5. Obligaciones del usuario</h2>
      <p>Responder con sinceridad, ser mayor de edad, suministrar datos de contacto veraces y no compartir el enlace personal de acceso.</p>
      <h2>6. Limitación de responsabilidad</h2>
      <p>La plataforma no presta atención de urgencias. Ante una crisis, el usuario debe acudir a la {BRAND.crisisLine} o al servicio de urgencias más cercano.</p>
      <h2>7. Contacto</h2>
      <p><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></p>
    </>
  );
}
