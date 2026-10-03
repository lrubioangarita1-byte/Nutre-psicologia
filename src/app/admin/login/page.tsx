import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Ingreso administración", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="narrow" style={{ padding: "80px 24px", maxWidth: 420 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><span className="mono">{BRAND.monogram}</span></div>
      <h1 style={{ textAlign: "center", fontSize: 26, marginBottom: 24 }}>Panel de administración</h1>
      <LoginForm />
    </main>
  );
}
