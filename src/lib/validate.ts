import { sanitizeCpt, type QuestionInstrument, type Responses } from "./instruments";
import type { Pack } from "./packs";

/** Normaliza respuestas recibidas del navegador: solo instrumentos del pack, índices válidos o null. */
export function sanitizeResponses(pack: Pack, raw: unknown): Responses {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Responses = {};
  for (const inst of pack.instruments) {
    if (inst.kind === "game") {
      if (input.cpt && typeof input.cpt === "object") out.cpt = sanitizeCpt(input.cpt);
      continue;
    }
    const arr = input[inst.id];
    if (!Array.isArray(arr)) continue;
    const q = inst as QuestionInstrument;
    out[q.id] = q.items.map((_, i) => {
      const v = arr[i];
      return Number.isInteger(v) && v >= 0 && v < q.scale.length ? (v as number) : null;
    });
  }
  return out;
}
