import { NextResponse } from "next/server";
import { rateLimited } from "@/lib/rate-limit";
import { db } from "@/lib/supabase/admin";
import { getPack, packInstrumentIds, type PackId } from "@/lib/packs";
import { caseInfo, getSubmissionByToken } from "@/lib/submissions";
import { computeScores, elevatedFlags, riskLevel } from "@/lib/instruments";
import { sanitizeResponses } from "@/lib/validate";
import { buildReportDraft } from "@/lib/report";
import { recordRiskEvent } from "@/lib/risk";
import { notifyNewCase } from "@/lib/email";

/**
 * Cierra la evaluación: calcula puntajes en el servidor, fija el nivel de riesgo,
 * genera el borrador del informe y avisa a Laura. Idempotente.
 */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  if (rateLimited(req, "finalizar", 30, 10 * 60_000)) return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  const { token } = await ctx.params;
  const sub = await getSubmissionByToken(token);
  const pack = sub && getPack(sub.pack_id);
  if (!sub || !pack) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (sub.estado !== "en_progreso") {
    if (sub.puntajes) return NextResponse.json({ scores: sub.puntajes, crisis: sub.nivel_riesgo === "crisis" });
    return NextResponse.json({ error: "Esta evaluación no está activa" }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const respuestas = sanitizeResponses(pack, body.respuestas);
  let scores;
  try {
    scores = computeScores(packInstrumentIds(pack), respuestas);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Respuestas incompletas" }, { status: 400 });
  }
  if (pack.clinical && sub.respuesta_pregunta_seguridad === null) {
    return NextResponse.json({ error: "Falta responder la pregunta de seguridad" }, { status: 400 });
  }

  const crisis = sub.nivel_riesgo === "crisis" || sub.respuesta_pregunta_seguridad === true;
  const nivel = riskLevel(scores, crisis);
  const flags = elevatedFlags(scores);

  const { data: done } = await db()
    .from("submissions")
    .update({
      respuestas,
      puntajes: scores,
      nivel_riesgo: nivel,
      estado: "pendiente",
      completado_at: new Date().toISOString(),
    })
    .eq("id", sub.id)
    .eq("estado", "en_progreso")
    .select("id");
  if (!done || done.length === 0) {
    // Otra petición ya cerró la evaluación.
    return NextResponse.json({ scores, crisis });
  }

  await db().from("reports").upsert(
    {
      submission_id: sub.id,
      borrador: buildReportDraft({ packId: pack.id as PackId, clientName: sub.cliente_nombre, referredBy: sub.remitido_por, scores }),
    },
    { onConflict: "submission_id" },
  );

  const info = caseInfo(sub);
  if (flags.length > 0) {
    await recordRiskEvent(info, "elevado", { flags, puntajes: scores });
  } else if (!crisis) {
    try {
      await notifyNewCase(info);
    } catch (e) {
      console.error("[finalizar] no se pudo notificar el caso nuevo", e);
    }
  }

  return NextResponse.json({ scores, crisis });
}
