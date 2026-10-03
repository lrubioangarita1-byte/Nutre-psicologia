import "server-only";
import { db } from "./supabase/admin";
import { notifyCrisis, notifyElevated, type CaseInfo } from "./email";

/**
 * Registra un evento de riesgo (evidencia con fecha/hora) y notifica a Laura.
 * El registro se guarda SIEMPRE antes de intentar notificar; si la notificación
 * falla, el error queda anotado en el evento y en los logs.
 */
export async function recordRiskEvent(
  c: CaseInfo,
  tipo: "crisis" | "elevado",
  detalle: Record<string, unknown>,
) {
  const { data: ev, error } = await db()
    .from("risk_events")
    .insert({ submission_id: c.id, tipo, detalle })
    .select("id, created_at")
    .single();
  if (error) {
    console.error("[riesgo] no se pudo registrar el evento", error);
  }

  try {
    if (tipo === "crisis") await notifyCrisis(c, new Date(ev?.created_at ?? Date.now()));
    else await notifyElevated(c, (detalle.flags as string[]) ?? []);
    if (ev) await db().from("risk_events").update({ notificado_at: new Date().toISOString() }).eq("id", ev.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[riesgo] FALLÓ la notificación ${tipo} del caso ${c.id}: ${msg}`);
    if (ev) await db().from("risk_events").update({ notificacion_error: msg }).eq("id", ev.id);
  }
}
