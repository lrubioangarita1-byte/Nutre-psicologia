import { NextResponse } from "next/server";
import { rateLimited } from "@/lib/rate-limit";
import { db } from "@/lib/supabase/admin";
import { caseInfo, getSubmissionByToken, hasConsent } from "@/lib/submissions";
import { recordRiskEvent } from "@/lib/risk";
import { SAFETY_QUESTION } from "@/lib/instruments";

/**
 * Respuesta a la pregunta de seguridad. Se guarda en el momento en que el cliente
 * contesta (no al final), para que la alerta urgente salga aunque cierre la pestaña.
 */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  if (rateLimited(req, "seguridad", 30, 10 * 60_000)) return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  const { token } = await ctx.params;
  const sub = await getSubmissionByToken(token);
  if (!sub) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (!hasConsent(sub)) return NextResponse.json({ error: "Primero debes aceptar el consentimiento informado" }, { status: 403 });
  if (sub.estado !== "en_progreso") return NextResponse.json({ error: "Esta evaluación ya no admite cambios" }, { status: 409 });

  const body = await req.json().catch(() => ({}));
  if (typeof body.respuesta !== "boolean") return NextResponse.json({ error: "Respuesta inválida" }, { status: 400 });
  const yes = body.respuesta;

  // Una vez marcado como crisis, el caso no se "desmarca" aunque el cliente cambie su respuesta.
  const update: Record<string, unknown> = { respuesta_pregunta_seguridad: sub.nivel_riesgo === "crisis" ? true : yes };
  if (yes) update.nivel_riesgo = "crisis";
  await db().from("submissions").update(update).eq("id", sub.id);

  if (yes && sub.nivel_riesgo !== "crisis") {
    await recordRiskEvent(caseInfo(sub), "crisis", {
      pregunta: SAFETY_QUESTION,
      respuesta: "Sí",
      user_agent: req.headers.get("user-agent"),
    });
  }
  return NextResponse.json({ ok: true, crisis: yes || sub.nivel_riesgo === "crisis" });
}
