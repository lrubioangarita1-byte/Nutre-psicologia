import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
import { signOut } from "../actions";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const email = await requireAdmin();
  return (
    <>
      <div className="admin-top">
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span className="mono">{BRAND.monogram}</span> Panel · {BRAND.product}
        </Link>
        <form action={signOut} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ opacity: 0.8 }}>{email}</span>
          <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 13, background: "transparent", borderColor: "var(--rose)" }}>
            Salir
          </button>
        </form>
      </div>
      <div className="admin-body">{children}</div>
    </>
  );
}
