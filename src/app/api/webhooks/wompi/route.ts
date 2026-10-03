import { NextResponse } from "next/server";
import { verifyWompiEvent } from "@/lib/payments/wompi";
import { verifyWompiTransaction } from "@/lib/payments";

/** Evento `transaction.updated` de Wompi. Configurar la URL en el panel de Wompi. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !verifyWompiEvent(body)) {
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }
  const txId = body?.data?.transaction?.id;
  if (body.event === "transaction.updated" && typeof txId === "string") {
    // Se vuelve a consultar la transacción en la API de Wompi como fuente de verdad.
    await verifyWompiTransaction(txId);
  }
  return NextResponse.json({ ok: true });
}
