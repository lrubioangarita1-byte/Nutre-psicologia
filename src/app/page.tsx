import Link from "next/link";
import { SiteFooter, SiteHeader, Wave } from "@/components/Site";
import { PACKS, PACK_GROUPS, type Pack } from "@/lib/packs";
import { BRAND } from "@/lib/brand";

function PackCard({ pack }: { pack: Pack }) {
  const premium = pack.group === "empresas";
  return (
    <div className={`pack${pack.status === "proximamente" ? " soon" : ""}${premium ? " premium" : ""}`}>
      <div className="pack-eyebrow">
        {pack.eyebrow}
        {pack.status === "proximamente" && <span className="badge-soon">Próximamente</span>}
      </div>
      <div className="pack-name">{pack.name}</div>
      <div className="pack-desc">{pack.description}</div>
      <ul className="pack-includes">
        {pack.includes.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <div className="pack-price">
        ${pack.priceUsd}
        <small>USD</small>
      </div>
      {pack.status === "disponible" && (
        <Link href={`/packs/${pack.id}`} className="btn btn-primary">
          Comenzar
        </Link>
      )}
      {pack.status === "proximamente" && <span className="btn-disabled">En preparación</span>}
      {pack.status === "contacto" && (
        <a
          href={`mailto:${BRAND.email}?subject=${encodeURIComponent("Solicitud — Selección de personal")}`}
          className="btn btn-ghost"
          style={{ borderColor: "var(--rose)", color: "var(--on-olive)", background: "transparent" }}
        >
          Solicitar
        </a>
      )}
    </div>
  );
}

export default function Home() {
  const minPrice = Math.min(...Object.values(PACKS).filter((p) => p.status === "disponible").map((p) => p.priceUsd));
  return (
    <>
      <SiteHeader />
      <main>
        <header className="hero wrap">
          <div className="kicker">Evaluación online · sin cita, sin videollamada</div>
          <h1>
            Claridad sobre ti <em>en un informe.</em>
          </h1>
          <p className="lead">
            Responde la prueba en línea cuando quieras. En 12–24 horas recibes un informe personalizado con tus resultados e
            interpretación, revisado y aprobado por una psicóloga. Para personas que quieren autoconocimiento, y para
            psicólogos o empresas que necesitan un concepto técnico externo.
          </p>
          <div className="hero-actions">
            <a href="#servicios" className="btn btn-primary">Ver los servicios</a>
            <a href="#como-funciona" className="btn btn-ghost">Cómo funciona</a>
          </div>
          <div className="hero-figure">
            <div className="stat"><b>Desde ${minPrice}</b><span>por evaluación</span></div>
            <div className="stat"><b>15–30 min</b><span>para responder la prueba</span></div>
            <div className="stat"><b>12–24h</b><span>entrega del informe</span></div>
            <div className="stat"><b>TP {BRAND.tp}</b><span>psicóloga con tarjeta profesional</span></div>
          </div>
        </header>

        <Wave />

        <section className="section wrap" id="como-funciona">
          <div className="section-head">
            <h2>Cómo funciona</h2>
            <p>Un proceso corto, sin compromisos de largo plazo.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="num">Uno</div>
              <h3>Eliges y pagas</h3>
              <p>Seleccionas la evaluación, aceptas el consentimiento informado y pagas en línea (Wompi en pesos o tarjeta internacional en dólares).</p>
            </div>
            <div className="step">
              <div className="num">Dos</div>
              <h3>Respondes la prueba</h3>
              <p>Accedes de inmediato y respondes a tu ritmo. Tu avance se guarda solo, y te llega un enlace por correo para retomarlo.</p>
            </div>
            <div className="step">
              <div className="num">Tres</div>
              <h3>Recibes tu informe</h3>
              <p>En 12–24 horas te llega por correo un informe personalizado, revisado y aprobado por Laura antes de enviarse.</p>
            </div>
          </div>
        </section>

        <section className="section wrap" id="servicios">
          <div className="section-head">
            <h2>Catálogo de servicios</h2>
            <p>
              Packs pensados para ser accesibles — ideales para autoconocimiento personal, tamizaje clínico orientativo, o para que
              tu psicólogo te los remita entre sesiones. Ninguno sustituye una evaluación clínica completa ni un proceso terapéutico.
            </p>
          </div>

          {PACK_GROUPS.map((g) => (
            <div key={g.id}>
              <div className="pack-group-label">{g.label}</div>
              <div className="packs">
                {g.packs.map((id) => (
                  <PackCard key={id} pack={PACKS[id]} />
                ))}
              </div>
            </div>
          ))}

          <div className="safety-note" role="note">
            <span aria-hidden="true">⚠</span>
            <div>
              <b>Antes de continuar:</b> estos packs son tamizajes orientativos, no diagnósticos ni terapia, y toda la información
              que compartas es confidencial. Si en algún momento sientes que estás en crisis o piensas en hacerte daño, comunícate
              ya con la {BRAND.crisisLine} y no esperes tu informe.
            </div>
          </div>
        </section>

        <section className="section wrap">
          <div className="section-head">
            <h2>¿Para quién es esto?</h2>
          </div>
          <div className="audience">
            <div className="audience-card">
              <h3>Para ti, si buscas autoconocimiento</h3>
              <p>
                Estudiantes eligiendo carrera, profesionales en transición, o cualquier persona con curiosidad genuina por entenderse
                mejor — sin comprometerse a un proceso terapéutico.
              </p>
            </div>
            <div className="audience-card">
              <h3>Para psicólogos y equipos de RR. HH.</h3>
              <p>
                Remite uno de estos packs a tu paciente entre sesiones, con tu crédito como remitente en el informe. O úsalo como
                segunda opinión técnica externa para procesos de selección.
              </p>
            </div>
          </div>
        </section>

        <section className="section wrap" id="sobre-mi">
          <div className="section-head">
            <h2>Sobre mí</h2>
          </div>
          <div className="credential">
            <div className="tag">{BRAND.fullName.toUpperCase()} · PSICÓLOGA · TARJETA PROFESIONAL {BRAND.tp}</div>
            <p>
              Psicología y Administración de Empresas (Universidad de los Andes), Máster en Management (IE Business School).
              Práctica independiente con adolescentes y adultos, y experiencia liderando gestión humana en salud.
            </p>
          </div>
          <div className="disclaimer">
            Estas son evaluaciones puntuales, no psicoterapia ni diagnóstico clínico definitivo. Los resultados son orientativos.
            Antes de responder cualquier prueba se presenta el consentimiento informado completo, que debes aceptar para continuar.
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
