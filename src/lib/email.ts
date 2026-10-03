import "server-only";
import { Resend } from "resend";
import { env } from "./env";
import { BRAND } from "./brand";
import { escapeHtml } from "./report";

type Mail = { to: string | string[]; subject: string; html: string; text?: string; priority?: "urgente" };

/** Envía un correo con Resend. Sin RESEND_API_KEY (desarrollo) lo imprime en consola. */
export async function sendEmail(mail: Mail): Promise<string> {
  const key = env.resendKey();
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY no configurada");
    console.info(`[correo simulado] Para: ${mail.to} · Asunto: ${mail.subject}`);
    return "dev-sin-envio";
  }
  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from: env.emailFrom(),
    to: mail.to,
    replyTo: env.emailReplyTo(),
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    headers: mail.priority === "urgente" ? { "X-Priority": "1", Importance: "high" } : undefined,
  });
  if (error || !data) throw new Error(`Resend: ${error?.message ?? "sin respuesta"}`);
  return data.id;
}

const wrap = (inner: string) =>
  `<div style="font-family:'Quicksand',Arial,sans-serif;color:#3A3415;background:#FCEFDC;padding:24px;line-height:1.6"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #E6D2B8">${inner}</div></div>`;

export type CaseInfo = {
  id: string;
  pack_name: string;
  cliente_nombre: string;
  cliente_correo: string;
  cliente_whatsapp: string | null;
  remitido_por: string | null;
};

function caseTable(c: CaseInfo) {
  const row = (k: string, v: string | null) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6B6135"><b>${k}</b></td><td style="padding:4px 0">${escapeHtml(v || "—")}</td></tr>`;
  const wa = c.cliente_whatsapp ? c.cliente_whatsapp.replace(/\D/g, "") : "";
  return `<table style="font-size:14px;border-collapse:collapse">${row("Cliente", c.cliente_nombre)}${row("Correo", c.cliente_correo)}${row("WhatsApp", c.cliente_whatsapp)}${row("Pack", c.pack_name)}${row("Remitido por", c.remitido_por)}</table>
${wa ? `<p><a href="https://wa.me/${wa}" style="color:#EF6328;font-weight:700">Abrir WhatsApp del cliente</a></p>` : ""}
<p><a href="${env.siteUrl()}/admin/casos/${c.id}" style="display:inline-block;background:#5B5120;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700">Abrir el caso en el panel</a></p>`;
}

/** Alerta URGENTE: el cliente respondió "Sí" a la pregunta de seguridad. */
export async function notifyCrisis(c: CaseInfo, at: Date) {
  const when = at.toLocaleString("es-CO", { timeZone: "America/Bogota" });
  return sendEmail({
    to: env.alertEmails(),
    priority: "urgente",
    subject: `🚨 URGENTE — Riesgo en pregunta de seguridad: ${c.cliente_nombre}`,
    html: wrap(`<div style="background:#EF6328;color:#fff;border-radius:10px;padding:16px;margin-bottom:16px"><b style="font-size:17px">Protocolo de riesgo activado</b><br>${escapeHtml(c.cliente_nombre)} respondió <b>"Sí"</b> a la pregunta de seguridad el ${escapeHtml(when)} (hora Colombia).</div>
<p>Al cliente ya se le mostró en pantalla el mensaje de crisis con la ${escapeHtml(BRAND.crisisLine)}. Se recomienda contacto humano prioritario.</p>${caseTable(c)}`),
    text: `URGENTE: ${c.cliente_nombre} (${c.cliente_correo}, WhatsApp ${c.cliente_whatsapp ?? "—"}) respondió "Sí" a la pregunta de seguridad el ${when}. Caso: ${env.siteUrl()}/admin/casos/${c.id}`,
  });
}

/** Notificación PRIORITARIA: algún instrumento supera el umbral de riesgo elevado. */
export async function notifyElevated(c: CaseInfo, flags: string[]) {
  return sendEmail({
    to: env.alertEmails(),
    subject: `⚠ Prioritario — Riesgo elevado: ${c.cliente_nombre} (${c.pack_name})`,
    html: wrap(`<h2 style="font-family:Georgia,serif;color:#5B5120;margin-top:0">Caso con riesgo elevado</h2>
<ul>${flags.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>${caseTable(c)}`),
  });
}

/** Aviso normal de caso nuevo pendiente de revisión. */
export async function notifyNewCase(c: CaseInfo) {
  return sendEmail({
    to: env.alertEmails(),
    subject: `Nuevo caso pendiente: ${c.cliente_nombre} (${c.pack_name})`,
    html: wrap(`<h2 style="font-family:Georgia,serif;color:#5B5120;margin-top:0">Nuevo caso pendiente de revisión</h2>${caseTable(c)}`),
  });
}

/** Al cliente: enlace para responder su pack (sirve para retomarlo si cierra la pestaña). */
export async function sendAccessLink(to: string, name: string, packName: string, url: string) {
  return sendEmail({
    to,
    subject: `Tu acceso al pack "${packName}"`,
    html: wrap(`<p>Hola ${escapeHtml(name)},</p><p>Tu pago fue confirmado. Puedes responder tu pack <b>${escapeHtml(packName)}</b> cuando quieras desde este enlace (también sirve para retomarlo si lo dejas a medias):</p>
<p><a href="${url}" style="display:inline-block;background:#5B5120;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">Responder mi evaluación</a></p>
<p style="font-size:13px;color:#6B6135">Este enlace es personal; no lo compartas. Si en algún momento sientes que estás en crisis, comunícate con la ${escapeHtml(BRAND.crisisLine)}.</p>
<p>${escapeHtml(BRAND.fullName)}<br>Psicóloga · TP ${BRAND.tp}</p>`),
  });
}
