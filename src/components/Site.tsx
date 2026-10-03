import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Wave({ className = "wave" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 34" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,18 C150,2 300,34 450,18 C600,2 750,34 900,18 C1050,2 1150,10 1200,18 L1200,34 L0,34 Z" fill="currentColor" opacity="0.55" />
      <circle cx="60" cy="10" r="4" fill="currentColor" />
      <circle cx="1140" cy="10" r="4" fill="currentColor" />
    </svg>
  );
}

export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="mono">LR</span>
      <span>
        {BRAND.name}
        <span className="sub">PSICOLOGÍA DEL BIENESTAR</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <>
      <div className="trust-strip">
        Psicóloga · Tarjeta Profesional {BRAND.tp} <span>|</span> Confidencialidad garantizada <span>|</span> Informes en 12–24h
      </div>
      <div className="top-wrap">
        <nav className="top">
          <Brand />
          <div className="nav-links">
            <Link href="/#servicios">Servicios</Link>
            <Link href="/#como-funciona">Cómo funciona</Link>
            <Link href="/#sobre-mi">Sobre mí</Link>
            <Link href="/#contacto">Contacto</Link>
          </div>
        </nav>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site" id="contacto">
      <Wave />
      <div className="wrap foot-grid">
        <div>
          <div className="brand" style={{ marginBottom: 10 }}>Comienza tu evaluación</div>
          <Link href="/#servicios" className="btn btn-coral">Elegir mi prueba</Link>
          <p style={{ fontSize: 14, marginTop: 16 }}>
            ¿Empresa o psicólogo/a remitente? Escríbeme a <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </p>
        </div>
        <div className="legal-links">
          <Link href="/legal/terminos">Términos y Condiciones</Link>
          <Link href="/legal/privacidad">Política de Datos</Link>
          <Link href="/legal/consentimiento">Consentimiento Informado</Link>
        </div>
      </div>
      <div className="wrap fine">
        {BRAND.fullName} · Psicóloga · Tarjeta Profesional {BRAND.tp}. Estas evaluaciones son tamizajes orientativos y no
        sustituyen una evaluación clínica completa ni atención de urgencias. Si estás en crisis, comunícate con la{" "}
        {BRAND.crisisLine}.
      </div>
    </footer>
  );
}
