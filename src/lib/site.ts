/**
 * URL pública del sitio (sin / final). Prioridad:
 * 1. NEXT_PUBLIC_SITE_URL (tu dominio)
 * 2. Dominio de producción que asigna Vercel automáticamente
 * 3. localhost en desarrollo
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")
).replace(/\/$/, "");
