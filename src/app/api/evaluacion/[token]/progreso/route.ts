import { NextResponse } from "next/server";
import { rateLimited } from "@/lib/rate-limit";
import { db } from "@/lib/supabase/admin";
import { getPack } from "@/lib/packs";
import { getSubmissionByToken, hasConsent } from "@/lib/submissions";
import { sanitizeResponses } from "@/lib/validate";

/** Guarda automáticamente el avance (respuestas parciales). */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  if (rateLimited(req, "progreso", 300, 10 * 60_000)) return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  const { token } = await ctx.params;
  const sub = await getSubmissionByToken(token);
  const pack = sub && getPack(sub.pack_id);
  if (!sub || !pack) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (!hasConsent(sub)) return NextResponse.json({ error: "Primero debes aceptar el consentimiento informado" }, { status: 403 });
  if (sub.estado !== "en_progreso") return NextResponse.json({ error: "Esta evaluación ya no admite cambios" }, { status: 409 });

  const body = await req.json().catch(() => ({}));
  const respuestas = sanitizeResponses(pack, body.respuestas);
  await db().from("submissions").update({ respuestas }).eq("id", sub.id).eq("estado", "en_progreso");
  // Primera respuesta guardada: el servicio empezó a ejecutarse (relevante para el derecho de retracto).
  await db().from("submissions").update({ iniciado_at: new Date().toISOString() }).eq("id", sub.id).is("iniciado_at", null);
  return NextResponse.json({ ok: true });
}
