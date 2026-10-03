import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "./supabase/admin";
import { getPack } from "./packs";
import type { CaseInfo } from "./email";
import type { Responses, Scores } from "./instruments";

export const CONSENT_VERSION = "2026-10-v1";

export type Submission = {
  id: string;
  access_token: string;
  pack_id: string;
  cliente_nombre: string;
  cliente_correo: string;
  cliente_whatsapp: string | null;
  remitido_por: string | null;
  respuestas: Responses;
  puntajes: Scores | null;
  respuesta_pregunta_seguridad: boolean | null;
  nivel_riesgo: "normal" | "elevado" | "crisis";
  estado: "esperando_pago" | "en_progreso" | "pendiente" | "revisado" | "enviado";
  fecha_creacion: string;
  pagado_at: string | null;
  completado_at: string | null;
};

export function newAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function isValidToken(t: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(t);
}

export async function getSubmissionByToken(token: string): Promise<Submission | null> {
  if (!isValidToken(token)) return null;
  const { data } = await db().from("submissions").select("*").eq("access_token", token).maybeSingle<Submission>();
  return data ?? null;
}

export function caseInfo(s: Submission): CaseInfo {
  return {
    id: s.id,
    pack_name: getPack(s.pack_id)?.name ?? s.pack_id,
    cliente_nombre: s.cliente_nombre,
    cliente_correo: s.cliente_correo,
    cliente_whatsapp: s.cliente_whatsapp,
    remitido_por: s.remitido_por,
  };
}
