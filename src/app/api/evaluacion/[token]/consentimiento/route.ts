import { NextResponse } from "next/server";
import { rateLimited } from "@/lib/rate-limit";
import { db } from "@/lib/supabase/admin";
import { getPack } from "@/lib/packs";
import { CONSENT_VERSION, getSubmissionByToken } from "@/lib/submissions";

/** Aceptación del consentimiento para evaluaciones creadas desde el panel (sin pasar por la compra). */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  if (rateLimited(req, "consentimiento", 20, 10 * 60_000)) return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  const { token } = await ctx.params;
  const sub = await getSubmissionByToken(token);
  const pack = sub && getPack(sub.pack_id);
  if (!sub || !pack) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (sub.estado !== "en_progreso") return NextResponse.json({ error: "Esta evaluación ya no admite cambios" }, { status: 409 });

  const b = await req.json().catch(() => ({}));
  if (b.consentimiento !== true || b.tratamientoDatos !== true || b.datosSensibles !== true || b.mayorDeEdad !== true || (pack.clinical && b.addendumClinico !== true)) {
    return NextResponse.json({ error: "Debes aceptar todos los puntos para continuar." }, { status: 400 });
  }
  const now = new Date().toISOString();
  const prev = sub.aceptacion ?? { documentos: [] as string[] };
  const aceptacion = {
    ...prev,
    version: CONSENT_VERSION,
    fecha: now,
    documentos: [
      ...new Set([
        ...(prev.documentos ?? []),
        "consentimiento_informado",
        "terminos_y_condiciones",
        "politica_tratamiento_datos",
        "autorizacion_datos_sensibles",
        "transmision_internacional",
        "mayor_de_edad",
        ...(pack.clinical ? ["addendum_clinico_protocolo_riesgo"] : []),
      ]),
    ],
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip"),
    user_agent: req.headers.get("user-agent"),
  };
  await db().from("submissions").update({ aceptacion, consentimiento_version: CONSENT_VERSION, consentimiento_aceptado_at: now }).eq("id", sub.id);
  return NextResponse.json({ ok: true });
}
