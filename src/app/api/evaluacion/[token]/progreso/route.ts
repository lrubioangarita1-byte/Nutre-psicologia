import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/admin";
import { getPack } from "@/lib/packs";
import { getSubmissionByToken } from "@/lib/submissions";
import { sanitizeResponses } from "@/lib/validate";

/** Guarda automáticamente el avance (respuestas parciales). */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const sub = await getSubmissionByToken(token);
  const pack = sub && getPack(sub.pack_id);
  if (!sub || !pack) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (sub.estado !== "en_progreso") return NextResponse.json({ error: "Esta evaluación ya no admite cambios" }, { status: 409 });

  const body = await req.json().catch(() => ({}));
  const respuestas = sanitizeResponses(pack, body.respuestas);
  await db().from("submissions").update({ respuestas }).eq("id", sub.id).eq("estado", "en_progreso");
  return NextResponse.json({ ok: true });
}
