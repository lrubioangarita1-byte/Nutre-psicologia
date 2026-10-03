import "server-only";

/**
 * Límite simple de solicitudes por IP (en memoria, por instancia del servidor).
 * No es infalible en serverless, pero frena el abuso básico sin servicios de pago.
 */
const hits = new Map<string, number[]>();

export function rateLimited(req: Request, key: string, max: number, windowMs: number): boolean {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "desconocida";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(id, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return recent.length > max;
}
