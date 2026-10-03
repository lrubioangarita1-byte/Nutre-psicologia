/** Lectura centralizada de variables de entorno (solo servidor). */
import { SITE_URL } from "./site";
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

export const env = {
  siteUrl: () => SITE_URL,
  supabaseUrl: () => required("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  adminEmails: () =>
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  /** Correo(s) donde Laura recibe alertas de riesgo y casos nuevos. */
  alertEmails: () =>
    (process.env.ALERT_EMAILS || process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean),
  resendKey: () => process.env.RESEND_API_KEY || "",
  // Sin dominio verificado en Resend se usa su remitente de prueba, que solo puede enviar
  // al correo con el que se creó la cuenta de Resend. Con dominio: EMAIL_FROM=informes@lucernapsi.com
  emailFrom: () => process.env.EMAIL_FROM || "LucernaPsi <onboarding@resend.dev>",
  emailReplyTo: () => process.env.EMAIL_REPLY_TO || "Lrubioangarita1@gmail.com",
  stripeSecret: () => process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: () => process.env.STRIPE_WEBHOOK_SECRET || "",
  wompiPublicKey: () => process.env.WOMPI_PUBLIC_KEY || "",
  wompiPrivateKey: () => process.env.WOMPI_PRIVATE_KEY || "",
  wompiIntegritySecret: () => process.env.WOMPI_INTEGRITY_SECRET || "",
  wompiEventsSecret: () => process.env.WOMPI_EVENTS_SECRET || "",
  /** Solo para pruebas locales: permite saltar el pago. Nunca activar en producción. */
  paymentsBypass: () => process.env.PAYMENTS_BYPASS === "true" && process.env.NODE_ENV !== "production",
};

export function enabledProviders() {
  return {
    wompi: Boolean(env.wompiPublicKey() && env.wompiIntegritySecret()),
    stripe: Boolean(env.stripeSecret()),
    bypass: env.paymentsBypass(),
  };
}

/** Estado de configuración, para el panel de administración. */
export function configStatus() {
  const p = enabledProviders();
  return [
    { name: "Base de datos (Supabase)", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY), needed: "Obligatorio" },
    { name: "Correos (Resend)", ok: Boolean(env.resendKey()), needed: "Obligatorio: sin esto no salen informes ni alertas de crisis" },
    { name: "Alertas de riesgo a", ok: env.alertEmails().length > 0, needed: env.alertEmails().join(", ") || "Definir ALERT_EMAILS" },
    { name: "Pagos en pesos (Wompi)", ok: p.wompi, needed: "Al menos un medio de pago" },
    { name: "Webhook de Wompi", ok: Boolean(env.wompiEventsSecret()), needed: "Recomendado (pagos PSE pendientes)" },
    { name: "Pagos en dólares (Stripe)", ok: p.stripe, needed: "Opcional" },
    ...(p.stripe ? [{ name: "Webhook de Stripe", ok: Boolean(env.stripeWebhookSecret()), needed: "Recomendado" }] : []),
    { name: "Dominio propio", ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL), needed: SITE_URL },
  ];
}
