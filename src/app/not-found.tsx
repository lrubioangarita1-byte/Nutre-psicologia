import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Site";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="narrow" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 34 }}>No encontramos esta página</h1>
        <p className="app-sub" style={{ marginTop: 14 }}>
          Si buscabas tu evaluación, usa el enlace que te llegó por correo. Si el problema sigue, escríbenos.
        </p>
        <Link href="/" className="btn btn-primary">Ir al inicio</Link>
      </main>
      <SiteFooter />
    </>
  );
}
