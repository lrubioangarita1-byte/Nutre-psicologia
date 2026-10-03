import {
  ASRS,
  CPT,
  EAT26,
  GAD7,
  IPIP50,
  IPIP_DOMAINS,
  MAX_SCORE,
  PSS10,
  ROSENBERG,
  SCOFF,
  TMMS24,
  TMMS_DIMS,
  WURS25,
  bandIpip,
  bandTmms,
  clientBands,
  ipipDetail,
  tmmsDetail,
  type Instrument,
  type InstrumentId,
  type Scores,
} from "./instruments";

export type PackId =
  | "ansiedad"
  | "alimentacion"
  | "quiensoy"
  | "tdah"
  | "vocacional"
  | "autismo"
  | "seleccion";

export type PackGroup = "autoconocimiento" | "tamizaje" | "empresas";

export type Pack = {
  id: PackId;
  name: string;
  eyebrow: string;
  group: PackGroup;
  description: string;
  includes: string[];
  priceUsd: number;
  /** Precio en pesos colombianos para Wompi. Ajustar según la tasa vigente. */
  priceCop: number;
  status: "disponible" | "proximamente" | "contacto";
  instruments: Instrument[];
  /** Packs clínicos: pregunta de seguridad + addendum del consentimiento. */
  clinical: boolean;
  edResource?: boolean;
};

export const PACKS: Record<PackId, Pack> = {
  ansiedad: {
    id: "ansiedad",
    name: "Ansiedad y estrés",
    eyebrow: "PACK · AUTOCONOCIMIENTO",
    group: "autoconocimiento",
    description: "Para entender qué tanto te está pesando el día a día, y con qué recursos cuentas para manejarlo.",
    includes: ["GAD-7 (ansiedad)", "PSS-10 (estrés percibido)", "TMMS-24 (regulación emocional)"],
    priceUsd: 9,
    priceCop: 36000,
    status: "disponible",
    instruments: [GAD7, PSS10, TMMS24],
    clinical: true,
  },
  quiensoy: {
    id: "quiensoy",
    name: "Quién soy",
    eyebrow: "PACK · AUTOCONOCIMIENTO",
    group: "autoconocimiento",
    description: "Un retrato de tu personalidad, tu inteligencia emocional y tu autoestima.",
    includes: ["IPIP-50 Big Five (personalidad)", "TMMS-24 (inteligencia emocional)", "Escala de Rosenberg (autoestima)"],
    priceUsd: 9,
    priceCop: 36000,
    status: "disponible",
    instruments: [IPIP50, TMMS24, ROSENBERG],
    clinical: true,
  },
  vocacional: {
    id: "vocacional",
    name: "Vocacional completo",
    eyebrow: "PACK · DECISIONES DE CARRERA",
    group: "autoconocimiento",
    description: "Para quien está eligiendo carrera o valorando un cambio profesional.",
    includes: ["Intereses profesionales", "IPIP Big Five (personalidad)", "Escala de valores"],
    priceUsd: 12,
    priceCop: 48000,
    status: "proximamente",
    instruments: [],
    clinical: false,
  },
  alimentacion: {
    id: "alimentacion",
    name: "Alimentación y bienestar corporal",
    eyebrow: "PACK · TAMIZAJE",
    group: "tamizaje",
    description: "Tamizaje orientativo de actitudes y conductas alimentarias de riesgo. No es un diagnóstico.",
    includes: ["EAT-26", "SCOFF", "Pregunta de seguridad incluida"],
    priceUsd: 9,
    priceCop: 36000,
    status: "disponible",
    instruments: [EAT26, SCOFF],
    clinical: true,
    edResource: true,
  },
  tdah: {
    id: "tdah",
    name: "TDAH en adultos",
    eyebrow: "PACK · TAMIZAJE",
    group: "tamizaje",
    description: "Síntomas actuales y retrospectivos desde la infancia. Puerta de entrada a una evaluación completa si aplica.",
    includes: ["ASRS v1.1 (OMS)", "WURS-25 (síntomas de infancia)", "Prueba breve de atención"],
    priceUsd: 10,
    priceCop: 40000,
    status: "disponible",
    instruments: [ASRS, WURS25, CPT],
    clinical: true,
  },
  autismo: {
    id: "autismo",
    name: "Autismo en adultos",
    eyebrow: "PACK · TAMIZAJE",
    group: "tamizaje",
    description: "Tamizaje de rasgos del espectro autista, como puerta de entrada a una evaluación diagnóstica completa.",
    includes: ["AQ-10", "AQ-50"],
    priceUsd: 10,
    priceCop: 40000,
    status: "proximamente",
    instruments: [],
    clinical: true,
  },
  seleccion: {
    id: "seleccion",
    name: "Selección de personal",
    eyebrow: "PARA EMPRESAS Y RR. HH.",
    group: "empresas",
    description: "Perfil de comportamiento y competencias frente a un puesto de trabajo específico.",
    includes: ["Estilo de comportamiento", "Perfil de 20 competencias laborales (CompeTEA)"],
    priceUsd: 45,
    priceCop: 180000,
    status: "contacto",
    instruments: [],
    clinical: false,
  },
};

export const PACK_GROUPS: { id: PackGroup; label: string; packs: PackId[] }[] = [
  { id: "autoconocimiento", label: "Autoconocimiento y decisiones", packs: ["ansiedad", "quiensoy", "vocacional"] },
  { id: "tamizaje", label: "Tamizaje clínico especializado", packs: ["alimentacion", "tdah", "autismo"] },
  { id: "empresas", label: "Para empresas y RR. HH.", packs: ["seleccion"] },
];

export function getPack(id: string): Pack | null {
  return Object.prototype.hasOwnProperty.call(PACKS, id) ? PACKS[id as PackId] : null;
}

export function getAvailablePack(id: string): Pack | null {
  const p = getPack(id);
  return p && p.status === "disponible" ? p : null;
}

export function packInstrumentIds(pack: Pack): InstrumentId[] {
  return pack.instruments.map((i) => i.id);
}

/* ---------- Lectura preliminar (texto que ve el cliente al terminar) ---------- */
/** Texto con **negritas** en formato mínimo. */
export function preliminarySummary(packId: PackId, c: Scores): string {
  switch (packId) {
    case "ansiedad": {
      const gad = clientBands.gad7(c.gad7!).band.toLowerCase();
      const pss = clientBands.pss10(c.pss10!).band.toLowerCase();
      const rep = bandTmms(c.tmms24!.reparacion);
      const repText =
        rep === "Alta"
          ? "A tu favor: cuentas con buenos recursos para regular cómo te sientes una vez que aparece el malestar, lo cual amortigua bastante el impacto de lo anterior."
          : rep === "Media"
            ? "Cuentas con algunas herramientas para manejar esto, aunque no siempre te alcanzan — ahí hay una oportunidad clara de trabajo."
            : "Hoy cuentas con pocos recursos para regular cómo te sientes cuando esto aparece, lo que puede hacer que la ansiedad y el estrés 'se queden' más tiempo de lo necesario.";
      return `**Lectura preliminar:** tu nivel de ansiedad es **${gad}** y tu percepción de estrés es **${pss}**. ${repText}\n\nEsta es una lectura automática inicial — en tu informe personalizado, Laura cruza estos tres resultados con más profundidad y te da recomendaciones concretas según tu caso.`;
    }
    case "alimentacion": {
      const risk = c.eat26! >= 20 || c.scoff! >= 2;
      return risk
        ? "**Lectura preliminar:** tus respuestas muestran señales que ameritan una conversación con un profesional especializado en trastornos de la conducta alimentaria — no para alarmarte, sino porque entre más pronto se aborde, más fácil suele ser el proceso.\n\nEsta es una lectura automática inicial — en tu informe, Laura revisa el detalle y te orienta sobre los siguientes pasos."
        : "**Lectura preliminar:** no se identifican señales de alarma relevantes en este tamizaje. Eso no significa que tu relación con la comida sea perfecta — nadie la tiene — pero no hay indicios de un patrón de riesgo en este momento.";
    }
    case "quiensoy": {
      const ros = clientBands.rosenberg(c.rosenberg!).band.toLowerCase();
      const rep = bandTmms(c.tmms24!.reparacion).toLowerCase();
      const dom = c.ipip50!;
      const names = ["extraversión", "amabilidad", "responsabilidad", "estabilidad emocional", "apertura"];
      const top = names[dom.indexOf(Math.max(...dom))];
      return `**Lectura preliminar:** tu rasgo de personalidad más marcado es **${top}**. Tu autoestima es **${ros}** y tu capacidad de regular tus emociones es **${rep}** — la combinación de estos dos factores suele influir mucho en cómo enfrentas los momentos difíciles.\n\nEsta es una lectura automática inicial — en tu informe, Laura cruza tu perfil completo de personalidad con estos resultados para darte una lectura más profunda.`;
    }
    case "tdah": {
      const asrsPos = c.asrs! >= 4;
      const wursPos = c.wurs25! >= 46;
      const cpt = c.cpt
        ? ` En el ejercicio de atención, tuviste ${c.cpt.accuracy}% de aciertos con un tiempo de reacción promedio de ${c.cpt.avgRt ?? "—"} ms — un dato adicional informal, no una prueba neuropsicológica validada.`
        : "";
      const tail = "\n\nEsta es una lectura automática inicial — Laura la retoma con más detalle en tu informe.";
      if (asrsPos && wursPos)
        return `**Lectura preliminar:** tanto tus síntomas actuales como los de tu infancia son compatibles con un patrón de TDAH.${cpt} Esta combinación (presente + histórico) es justo lo que una evaluación diagnóstica completa necesita confirmar — vale la pena dar ese siguiente paso.${tail}`;
      if (asrsPos || wursPos)
        return `**Lectura preliminar:** se identifican algunas señales (${asrsPos ? "síntomas actuales" : "síntomas desde la infancia"}), pero no en ambos momentos de tu vida.${cpt} Esto no descarta nada, pero sí sugiere profundizar con más cuidado antes de sacar conclusiones.${tail}`;
      return `**Lectura preliminar:** no se identifica un patrón claro de TDAH ni en tus síntomas actuales ni en los de tu infancia, según este tamizaje.${cpt}`;
    }
    default:
      return "";
  }
}

/* ---------- Filas de resultados para la pantalla del cliente ---------- */
export type ResultLine = { label?: string; score: string; pct: number; risky: boolean; band: string; detail: string };
export type ResultBlock = { title: string; lines: ResultLine[]; note?: string };

export const pct = (s: number, max: number) => Math.min(100, Math.max(0, Math.round((s / max) * 100)));

/** Cuándo pintar la barra en coral (resultado que amerita atención). */
export const RISKY = {
  gad7: (s: number) => s >= 15,
  pss10: (s: number) => s >= 27,
  eat26: (s: number) => s >= 20,
  scoff: (s: number) => s >= 2,
  asrs: (s: number) => s >= 4,
  wurs25: (s: number) => s >= 46,
  rosenberg: (s: number) => s <= 19,
};

export function clientResultBlocks(pack: Pack, c: Scores): ResultBlock[] {
  const blocks: ResultBlock[] = [];
  for (const inst of pack.instruments) {
    switch (inst.id) {
      case "gad7":
      case "pss10":
      case "eat26":
      case "scoff":
      case "rosenberg":
      case "asrs":
      case "wurs25": {
        const s = c[inst.id]!;
        const b = clientBands[inst.id](s);
        const risky = RISKY[inst.id](s);
        blocks.push({ title: inst.name, lines: [{ score: `${s} / ${MAX_SCORE[inst.id]}`, pct: pct(s, MAX_SCORE[inst.id]), risky, band: b.band, detail: b.detail }] });
        break;
      }
      case "tmms24": {
        const t = c.tmms24!;
        blocks.push({
          title: inst.name,
          lines: TMMS_DIMS.map(([k, label]) => ({
            label,
            score: `${t[k]} / 40`,
            pct: pct(t[k], 40),
            risky: k === "reparacion" && bandTmms(t[k]) === "Baja",
            band: bandTmms(t[k]),
            detail: tmmsDetail(k, t[k]),
          })),
        });
        break;
      }
      case "ipip50": {
        const d = c.ipip50!;
        blocks.push({
          title: inst.name,
          lines: IPIP_DOMAINS.map((label, i) => ({
            label,
            score: `${d[i]} / 50`,
            pct: pct(d[i], 50),
            risky: false,
            band: bandIpip(d[i]),
            detail: ipipDetail(i, d[i]),
          })),
        });
        break;
      }
      case "cpt": {
        const r = c.cpt!;
        blocks.push({
          title: inst.name,
          lines: [{
            score: `${r.accuracy}% de aciertos`,
            pct: r.accuracy,
            risky: false,
            band: `Tiempo de reacción promedio: ${r.avgRt ? r.avgRt + " ms" : "—"} · Toques fuera de lugar: ${r.falseAlarms}`,
            detail: "",
          }],
          note: "Ejercicio ilustrativo corto — no es una prueba neuropsicológica validada, solo un complemento informal.",
        });
        break;
      }
    }
  }
  return blocks;
}
