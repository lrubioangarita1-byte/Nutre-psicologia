/** Lectura centralizada de variables de entorno (solo servidor). */
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

export const env = {
  siteUrl: () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
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
  emailFrom: () => process.env.EMAIL_FROM || "Laura Rubio · Psicología <informes@laurarubiopsicologia.com>",
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
