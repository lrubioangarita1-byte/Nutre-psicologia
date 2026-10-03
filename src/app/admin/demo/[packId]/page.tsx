import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/supabase/server";
import { getAvailablePack, type PackId } from "@/lib/packs";
import { TestRunner } from "@/components/TestRunner";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Demostración", robots: { index: false, follow: false } };

/** Recorrido completo del cliente, solo para la administradora. No guarda ni envía nada. */
export default async function DemoPage({ params }: { params: Promise<{ packId: string }> }) {
  await requireAdmin();
  const { packId } = await params;
  const pack = getAvailablePack(packId);
  if (!pack) notFound();
  return (
    <TestRunner
      demo
      token="demo"
      packId={pack.id as PackId}
      clientName="Cliente de prueba"
      initialResponses={{}}
      initialSafety={null}
    />
  );
}
