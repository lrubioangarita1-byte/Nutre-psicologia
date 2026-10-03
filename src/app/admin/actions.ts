"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient, isAdminEmail, requireAdmin } from "@/lib/supabase/server";
import { db } from "@/lib/supabase/admin";
import { renderReportHtml, type ReportDraft } from "@/lib/report";
import { sendEmail } from "@/lib/email";

export async function signIn(_prev: { error?: string } | undefined, form: FormData) {
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!isAdminEmail(email)) return { error: "Correo o contraseña incorrectos." };
  const supabase = await authClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Correo o contraseña incorrectos." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await authClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function cleanDraft(d: ReportDraft): ReportDraft {
  const t = (s: unknown, max = 8000) => String(s ?? "").slice(0, max);
  return {
    ...d,
    clientName: t(d.clientName, 200),
    referredBy: d.referredBy ? t(d.referredBy, 200) : null,
    summary: t(d.summary),
    recommendations: t(d.recommendations),
    instruments: d.instruments.map((i) => ({ ...i, lines: i.lines.map((l) => ({ ...l, tip: t(l.tip, 3000) })) })),
    exercises: d.exercises.slice(0, 6).map((e) => ({ title: t(e.title, 200), text: t(e.text, 3000) })),
  };
}

export async function saveDraft(submissionId: string, draft: ReportDraft) {
  await requireAdmin();
  const borrador = cleanDraft(draft);
  await db().from("reports").update({ borrador }).eq("submission_id", submissionId);
  await db().from("submissions").update({ estado: "revisado" }).eq("id", submissionId).eq("estado", "pendiente");
  revalidatePath(`/admin/casos/${submissionId}`);
  return { ok: true };
}

export async function approveAndSend(submissionId: string, draft: ReportDraft): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  const { data: sub } = await db().from("submissions").select("id, estado, cliente_correo, cliente_nombre").eq("id", submissionId).single();
  if (!sub) return { ok: false, error: "Caso no encontrado" };
  if (sub.estado === "enviado") return { ok: false, error: "Este informe ya fue enviado." };
  if (sub.estado !== "pendiente" && sub.estado !== "revisado") return { ok: false, error: "El cliente aún no ha terminado las pruebas." };

  const borrador = cleanDraft(draft);
  const now = new Date();
  const html = renderReportHtml(borrador, now);

  let emailId: string;
  try {
    emailId = await sendEmail({ to: sub.cliente_correo, subject: `Tu informe personalizado — ${borrador.packName}`, html });
  } catch (e) {
    await db().from("reports").update({ borrador }).eq("submission_id", submissionId);
    return { ok: false, error: `No se pudo enviar el correo: ${e instanceof Error ? e.message : e}` };
  }

  await db()
    .from("reports")
    .update({ borrador, contenido_editado: html, aprobado_por: admin, fecha_envio: now.toISOString(), email_id: emailId })
    .eq("submission_id", submissionId);
  await db().from("submissions").update({ estado: "enviado" }).eq("id", submissionId);
  revalidatePath("/admin");
  revalidatePath(`/admin/casos/${submissionId}`);
  return { ok: true };
}

export async function markRiskReviewed(eventId: string, submissionId: string) {
  const admin = await requireAdmin();
  await db()
    .from("risk_events")
    .update({ revisado_por: admin, revisado_at: new Date().toISOString() })
    .eq("id", eventId)
    .is("revisado_at", null);
  revalidatePath(`/admin/casos/${submissionId}`);
}
