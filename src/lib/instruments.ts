/**
 * Instrumentos psicométricos, escalas y lógica de puntaje.
 * Compartido entre cliente (motor de preguntas) y servidor (cálculo oficial de puntajes).
 *
 * Las respuestas se guardan como ÍNDICE de la opción elegida (0..n-1);
 * el valor numérico de cada opción se resuelve con `itemValue`, porque algunos
 * instrumentos (EAT-26) puntúan distinto según el ítem.
 */

export type ScaleOption = { v: number; l: string };

export type QuestionInstrument = {
  kind: "questions";
  id: QuestionInstrumentId;
  name: string;
  intro: string;
  icon?: InstrumentIcon;
  scale: ScaleOption[];
  items: string[];
};

export type GameInstrument = {
  kind: "game";
  id: "cpt";
  name: string;
  intro: string;
  icon?: InstrumentIcon;
};

export type Instrument = QuestionInstrument | GameInstrument;

export type InstrumentIcon = "heart" | "waves" | "target" | "circles" | "star" | "letter";

export type QuestionInstrumentId =
  | "gad7"
  | "pss10"
  | "tmms24"
  | "eat26"
  | "scoff"
  | "ipip50"
  | "rosenberg"
  | "asrs"
  | "wurs25";

export type InstrumentId = QuestionInstrumentId | "cpt";

export type TmmsScores = { atencion: number; claridad: number; reparacion: number };
export type CptResult = {
  accuracy: number;
  avgRt: number | null;
  falseAlarms: number;
  hits: number;
  misses: number;
};

export type Scores = {
  gad7?: number;
  pss10?: number;
  tmms24?: TmmsScores;
  eat26?: number;
  scoff?: number;
  ipip50?: number[];
  rosenberg?: number;
  asrs?: number;
  wurs25?: number;
  cpt?: CptResult;
};

/** Respuestas: índice de opción por ítem, o resultado del juego de atención. */
export type Responses = Partial<Record<QuestionInstrumentId, (number | null)[]>> & {
  cpt?: CptResult;
};

/* ---------- ESCALAS ---------- */
const SCALE_GAD: ScaleOption[] = [
  { v: 0, l: "Ningún día" },
  { v: 1, l: "Varios días" },
  { v: 2, l: "Más de la mitad de los días" },
  { v: 3, l: "Casi todos los días" },
];
const SCALE_PSS: ScaleOption[] = [
  { v: 0, l: "Nunca" },
  { v: 1, l: "Casi nunca" },
  { v: 2, l: "A veces" },
  { v: 3, l: "Con cierta frecuencia" },
  { v: 4, l: "Muy a menudo" },
];
const SCALE_TMMS: ScaleOption[] = [
  { v: 1, l: "Nada de acuerdo" },
  { v: 2, l: "Algo de acuerdo" },
  { v: 3, l: "Bastante de acuerdo" },
  { v: 4, l: "Muy de acuerdo" },
  { v: 5, l: "Totalmente de acuerdo" },
];
// EAT-26: el valor depende del ítem (ver itemValue). Aquí "v" es el valor de los ítems directos.
const SCALE_EAT: ScaleOption[] = [
  { v: 0, l: "Nunca" },
  { v: 0, l: "Rara vez" },
  { v: 0, l: "A veces" },
  { v: 1, l: "A menudo" },
  { v: 2, l: "Muy a menudo" },
  { v: 3, l: "Siempre" },
];
const SCALE_YESNO: ScaleOption[] = [
  { v: 1, l: "Sí" },
  { v: 0, l: "No" },
];
const SCALE_IPIP: ScaleOption[] = [
  { v: 1, l: "Muy en desacuerdo" },
  { v: 2, l: "En desacuerdo" },
  { v: 3, l: "Neutral" },
  { v: 4, l: "De acuerdo" },
  { v: 5, l: "Muy de acuerdo" },
];
const SCALE_ROSENBERG: ScaleOption[] = [
  { v: 1, l: "Muy en desacuerdo" },
  { v: 2, l: "En desacuerdo" },
  { v: 3, l: "De acuerdo" },
  { v: 4, l: "Muy de acuerdo" },
];
const SCALE_ASRS: ScaleOption[] = [
  { v: 0, l: "Nunca" },
  { v: 1, l: "Rara vez" },
  { v: 2, l: "A veces" },
  { v: 3, l: "Frecuentemente" },
  { v: 4, l: "Muy frecuentemente" },
];
const SCALE_WURS: ScaleOption[] = [
  { v: 0, l: "Nada o casi nada" },
  { v: 1, l: "Levemente" },
  { v: 2, l: "Moderadamente" },
  { v: 3, l: "Bastante" },
  { v: 4, l: "Mucho" },
];

/* ---------- INSTRUMENTOS ---------- */
export const GAD7: QuestionInstrument = {
  kind: "questions",
  id: "gad7",
  name: "GAD-7 — Ansiedad",
  scale: SCALE_GAD,
  intro:
    "¿Te ha pasado que te cuesta relajarte incluso cuando no hay nada 'urgente' pendiente, o que tu mente se va a lo peor con facilidad? Este bloque mide qué tanto te ha estado pasando eso en las últimas dos semanas — piensa en el trabajo, tus relaciones o el día a día en general.",
  items: [
    "Sentirte nervioso/a, ansioso/a o con los nervios de punta",
    "No ser capaz de parar o controlar tu preocupación",
    "Preocuparte demasiado por diferentes cosas",
    "Dificultad para relajarte",
    "Estar tan inquieto/a que te cuesta quedarte quieto/a",
    "Molestarte o irritarte con facilidad",
    "Sentir miedo, como si algo terrible fuera a pasar",
  ],
};

export const PSS10: QuestionInstrument = {
  kind: "questions",
  id: "pss10",
  name: "PSS-10 — Estrés percibido",
  scale: SCALE_PSS,
  intro:
    "Más que contar cuántas cosas tienes pendientes, esto mide algo distinto: qué tan desbordado/a te sientes frente a ellas. Dos personas con la misma carga de trabajo pueden sentir niveles de estrés muy diferentes — este bloque busca medir tu percepción, no tu agenda.",
  items: [
    "Has estado afectado/a por algo que ocurrió inesperadamente",
    "Has sentido que no podías controlar las cosas importantes de tu vida",
    "Te has sentido nervioso/a o estresado/a",
    "Has manejado con éxito los pequeños problemas de la vida diaria",
    "Has sentido que enfrentabas bien los cambios importantes en tu vida",
    "Te has sentido seguro/a de tu capacidad para manejar tus problemas personales",
    "Has sentido que las cosas te estaban saliendo bien",
    "Has podido controlar las dificultades de tu vida",
    "Has sentido que tenías el control de todo",
    "Has sentido que las dificultades se acumulaban tanto que no podías superarlas",
  ],
};
const PSS_REVERSE = [3, 4, 6, 7];

export const TMMS24: QuestionInstrument = {
  kind: "questions",
  id: "tmms24",
  name: "TMMS-24 — Inteligencia emocional",
  icon: "heart",
  scale: SCALE_TMMS,
  intro:
    "Este bloque mide tres cosas distintas: qué tanto te das cuenta de lo que sientes, qué tan claro tienes lo que sientes (¿es ansiedad o es cansancio?), y qué tan bien logras 'bajarle' a una emoción incómoda cuando aparece.",
  items: [
    "Presto mucha atención a mis sentimientos",
    "Normalmente me preocupo mucho por lo que siento",
    "Normalmente dedico tiempo a pensar en mis emociones",
    "Pienso que merece la pena prestar atención a mis emociones y estado de ánimo",
    "Dejo que mis sentimientos afecten mis pensamientos",
    "Pienso constantemente en mi estado de ánimo",
    "A menudo pienso en mis sentimientos",
    "Presto mucha atención a cómo me siento",
    "Tengo claros mis sentimientos",
    "Frecuentemente puedo definir mis sentimientos",
    "Casi siempre sé cómo me siento",
    "Normalmente conozco mis sentimientos sobre las cosas",
    "A menudo me doy cuenta de mis sentimientos en diferentes situaciones",
    "Siempre puedo decir cómo me siento",
    "A veces puedo decir cuáles son mis emociones",
    "Puedo llegar a comprender mis sentimientos",
    "Aunque a veces me siento triste, suelo tener una visión optimista",
    "Aunque me sienta mal, procuro pensar en cosas agradables",
    "Cuando estoy triste, pienso en todos los placeres de la vida",
    "Intento tener pensamientos positivos aunque me sienta mal",
    "Si doy demasiadas vueltas a las cosas, complicándolas, trato de calmarme",
    "Me preocupo por tener un buen estado de ánimo",
    "Tengo mucha energía cuando me siento feliz",
    "Cuando estoy enfadado/a intento cambiar mi estado de ánimo",
  ],
};

export const EAT26: QuestionInstrument = {
  kind: "questions",
  id: "eat26",
  name: "EAT-26 — Actitudes alimentarias",
  icon: "waves",
  scale: SCALE_EAT,
  intro:
    "Esto no es sobre si comes 'saludable' o no. Es sobre qué tanto espacio mental ocupa la comida y tu cuerpo en tu día a día — si piensas en calorías constantemente, si comer te genera culpa, o si sientes que la comida controla decisiones que deberían ser simples.",
  items: [
    "Me da mucho miedo pesar demasiado",
    "Evito comer cuando tengo hambre",
    "Me encuentro preocupado/a por la comida",
    "Me he dado atracones de comida sintiendo que no podía parar",
    "Corto mis alimentos en trozos pequeños",
    "Tengo en cuenta las calorías que tienen los alimentos que como",
    "Evito especialmente comer alimentos con muchos carbohidratos",
    "Siento que los demás preferirían que yo comiera más",
    "Vomito después de haber comido",
    "Me siento muy culpable después de comer",
    "Me preocupa el deseo de estar más delgado/a",
    "Pienso en quemar calorías cuando hago ejercicio",
    "Los demás piensan que estoy demasiado delgado/a",
    "Me preocupa la idea de tener grasa en mi cuerpo",
    "Tardo en comer más que las demás personas",
    "Evito comer alimentos con azúcar",
    "Como alimentos dietéticos",
    "Siento que la comida controla mi vida",
    "Muestro autocontrol frente a la comida",
    "Siento que los demás me presionan para que coma",
    "Le doy demasiado tiempo y pienso mucho en la comida",
    "Me siento incómodo/a después de comer dulces",
    "Me comprometo a hacer dieta",
    "Me gusta sentir el estómago vacío",
    "Disfruto probando comidas nuevas y sabrosas",
    "Tengo el impulso de vomitar después de las comidas",
  ],
};
/** Ítem 25 ("Disfruto probando comidas nuevas") se puntúa invertido. */
const EAT_REVERSE = [24];

export const SCOFF: QuestionInstrument = {
  kind: "questions",
  id: "scoff",
  name: "SCOFF — Tamizaje TCA",
  icon: "target",
  scale: SCALE_YESNO,
  intro:
    "Cinco preguntas directas, tipo sí/no, que suelen usarse como primer filtro clínico para conductas alimentarias de riesgo.",
  items: [
    "¿Te provocas el vómito porque te sientes incómodamente lleno/a?",
    "¿Te preocupa haber perdido el control sobre lo que comes?",
    "¿Has perdido recientemente más de 6 kg en un periodo de 3 meses?",
    "¿Crees que estás gordo/a aunque otros digan que estás demasiado delgado/a?",
    "¿Dirías que la comida domina tu vida?",
  ],
};

export const IPIP_DOMAINS = [
  "Extraversión",
  "Amabilidad",
  "Responsabilidad",
  "Estabilidad emocional",
  "Apertura / Intelecto",
];

export const IPIP50: QuestionInstrument = {
  kind: "questions",
  id: "ipip50",
  name: "IPIP-50 — Los cinco grandes rasgos de personalidad",
  icon: "circles",
  scale: SCALE_IPIP,
  intro:
    "50 afirmaciones cortas sobre cómo te comportas normalmente — no hay rasgo 'bueno' o 'malo', cada uno trae ventajas distintas según el contexto. Piensa en cómo eres la mayor parte del tiempo, no en un día particularmente bueno o malo.",
  // Orden: 10 ítems por dominio (Extraversión, Amabilidad, Responsabilidad, Estabilidad emocional, Apertura)
  items: [
    "Soy el alma de las fiestas", "Me siento cómodo/a entre personas", "Inicio conversaciones con facilidad",
    "Hablo con mucha gente diferente en las reuniones", "No me importa ser el centro de atención",
    "No hablo mucho", "Prefiero mantenerme en un segundo plano", "Tengo poco que decir",
    "Soy callado/a con los desconocidos", "No me gusta llamar la atención sobre mí mismo/a",

    "Me intereso poco por los demás", "Me interesan las personas", "Insulto a la gente",
    "Simpatizo con los sentimientos de los demás", "No me interesan los problemas de otras personas",
    "Tengo un corazón blando", "Realmente no me interesan los demás", "Dedico tiempo a los demás",
    "Siento las emociones de otras personas", "Hago que la gente se sienta cómoda",

    "Siempre estoy preparado/a", "Dejo mis cosas tiradas por ahí", "Presto atención a los detalles",
    "Dejo las cosas hechas un desastre", "Termino mis tareas de inmediato",
    "Frecuentemente olvido poner las cosas en su lugar", "Me gusta el orden", "Descuido mis deberes",
    "Sigo un horario", "Soy exigente en mi trabajo",

    "Me estreso con facilidad", "Estoy relajado/a la mayor parte del tiempo", "Me preocupo por las cosas",
    "Rara vez me siento triste", "Me altero con facilidad", "Me disgusto con facilidad",
    "Cambio mucho de humor", "Tengo cambios de ánimo frecuentes", "Me irrito con facilidad", "A menudo me siento triste",

    "Tengo un vocabulario amplio", "Tengo dificultad para entender ideas abstractas", "Tengo mucha imaginación",
    "No me interesan las ideas abstractas", "Tengo excelentes ideas", "No tengo buena imaginación",
    "Entiendo las cosas rápidamente", "Uso palabras difíciles", "Dedico tiempo a reflexionar sobre las cosas", "Estoy lleno/a de ideas",
  ],
};
// Ítems invertidos (0-indexed). Estabilidad emocional se puntúa en sentido "estabilidad":
// los ítems de malestar (30,32,34-39) se invierten.
const IPIP_REVERSE = [
  5, 6, 7, 8, 9,
  10, 12, 14, 16,
  21, 23, 25, 27,
  30, 32, 34, 35, 36, 37, 38, 39,
  41, 43, 45,
];

export const ROSENBERG: QuestionInstrument = {
  kind: "questions",
  id: "rosenberg",
  name: "Escala de Rosenberg — Autoestima",
  icon: "star",
  scale: SCALE_ROSENBERG,
  intro:
    "10 afirmaciones sobre cómo te ves y te tratas a ti mismo/a — no sobre cómo te ven los demás, sino sobre tu propio juicio interno.",
  items: [
    "Siento que soy una persona digna de aprecio, al menos en igual medida que los demás",
    "Estoy convencido/a de que tengo buenas cualidades",
    "Soy capaz de hacer las cosas tan bien como la mayoría de la gente",
    "Tengo una actitud positiva hacia mí mismo/a",
    "En general estoy satisfecho/a conmigo mismo/a",
    "Siento que no tengo mucho de lo que estar orgulloso/a",
    "En general, me inclino a pensar que soy un fracaso",
    "Me gustaría poder sentir más respeto por mí mismo/a",
    "Hay veces que realmente pienso que soy un inútil",
    "A veces creo que no soy buena persona",
  ],
};
const ROSENBERG_REVERSE = [5, 6, 7, 8, 9];

export const ASRS: QuestionInstrument = {
  kind: "questions",
  id: "asrs",
  name: "ASRS v1.1 — Tamizaje de TDAH en adultos (OMS)",
  scale: SCALE_ASRS,
  intro:
    "6 preguntas sobre cómo te ha ido en los últimos 6 meses con organización, memoria y quietud — pensadas para captar cómo se ve el TDAH en la vida adulta, que no siempre se parece a la hiperactividad infantil.",
  items: [
    "¿Con qué frecuencia tienes dificultad para finalizar los últimos detalles de un proyecto, una vez que ya hiciste las partes más difíciles?",
    "¿Con qué frecuencia tienes dificultad para poner las cosas en orden cuando tienes que hacer una tarea que requiere organización?",
    "¿Con qué frecuencia tienes problemas para recordar citas u obligaciones?",
    "Cuando tienes una tarea que requiere mucho pensar, ¿con qué frecuencia evitas o retrasas comenzarla?",
    "¿Con qué frecuencia mueves o retuerces las manos o los pies cuando tienes que sentarte durante mucho tiempo?",
    "¿Con qué frecuencia te sientes excesivamente activo/a, como si algo te impulsara a hacer cosas?",
  ],
};
/** Umbral oficial: ítems 1-3 cuentan desde "A veces" (2); ítems 4-6 desde "Frecuentemente" (3). */
const ASRS_THRESHOLD = [2, 2, 2, 3, 3, 3];

export const WURS25: QuestionInstrument = {
  kind: "questions",
  id: "wurs25",
  name: "WURS-25 — Síntomas de TDAH en la infancia (retrospectivo)",
  scale: SCALE_WURS,
  intro:
    "Esta parte mira hacia atrás: piensa en cómo eras de niño/a (entre los 6 y 12 años aproximadamente), no en cómo eres hoy. El TDAH en adultos casi siempre tiene raíces visibles en la infancia, aunque en su momento no se haya identificado.",
  items: [
    "De niño/a era inquieto/a, activo/a, me costaba quedarme sentado/a",
    "De niño/a era temeroso/a, me asustaba con facilidad",
    "De niño/a era nervioso/a, inquieto/a",
    "De niño/a era distraído/a, me costaba prestar atención",
    "De niño/a tenía mal genio, me irritaba con facilidad",
    "De niño/a tenía berrinches o rabietas",
    "De niño/a tenía problemas con la disciplina",
    "De niño/a era desafiante, respondón/a con los adultos",
    "De niño/a me costaba terminar lo que empezaba",
    "De niño/a era terco/a, con voluntad fuerte",
    "De niño/a me sentía triste o decaído/a",
    "De niño/a era inmaduro/a para mi edad",
    "De niño/a sentía culpa o remordimiento con facilidad",
    "De niño/a sentía que perdía el control de mí mismo/a",
    "De niño/a tendía a actuar de forma irracional",
    "De niño/a era impopular con otros niños, no mantenía amistades por mucho tiempo",
    "De niño/a me costaba ver las cosas desde el punto de vista de otra persona",
    "De niño/a tuve problemas con figuras de autoridad o en el colegio (citas a la dirección)",
    "De niño/a tuve problemas serios de conducta (policía, juzgado de menores)",
    "De niño/a era, en general, mal estudiante",
    "De niño/a tenía problemas con las matemáticas o los números",
    "De niño/a no rendía académicamente de acuerdo a mi potencial",
    "De niño/a repetí algún año escolar",
    "De niño/a fui suspendido/a o expulsado/a del colegio",
    "En general, de niño/a era desorganizado/a y con pocos hábitos de estudio",
  ],
};

export const CPT_LETTERS = [
  "A", "B", "X", "E", "K", "X", "M", "P", "X", "T", "A", "X",
  "D", "B", "X", "M", "P", "X", "K", "B", "X", "A", "E", "X",
];
export const CPT_TRIAL_MS = 850;

export const CPT: GameInstrument = {
  kind: "game",
  id: "cpt",
  name: "Prueba breve de atención",
  icon: "letter",
  intro:
    "Última parte, y esta es diferente: no son preguntas, es un pequeño ejercicio para observar tu atención en acción. Van a aparecer letras una por una, bastante rápido. Toca el botón SOLO cuando veas la letra X — para cualquier otra letra, no toques nada.",
};

export const INSTRUMENTS: Record<InstrumentId, Instrument> = {
  gad7: GAD7,
  pss10: PSS10,
  tmms24: TMMS24,
  eat26: EAT26,
  scoff: SCOFF,
  ipip50: IPIP50,
  rosenberg: ROSENBERG,
  asrs: ASRS,
  wurs25: WURS25,
  cpt: CPT,
};

export const SAFETY_QUESTION =
  "En las últimas dos semanas, ¿has tenido pensamientos de hacerte daño a ti mismo/a o de que la vida no vale la pena?";

/* ---------- PUNTAJE ---------- */

/** Valor numérico de la opción `optIdx` en el ítem `itemIdx`. */
export function itemValue(inst: QuestionInstrument, itemIdx: number, optIdx: number): number {
  if (inst.id === "eat26" && EAT_REVERSE.includes(itemIdx)) {
    // Ítem invertido: Nunca=3, Rara vez=2, A veces=1, resto=0
    return [3, 2, 1, 0, 0, 0][optIdx];
  }
  return inst.scale[optIdx].v;
}

function values(inst: QuestionInstrument, answers: (number | null)[] | undefined): number[] {
  if (!answers || answers.length !== inst.items.length) {
    throw new Error(`Respuestas incompletas para ${inst.id}`);
  }
  return answers.map((optIdx, i) => {
    if (optIdx === null || !Number.isInteger(optIdx) || optIdx < 0 || optIdx >= inst.scale.length) {
      throw new Error(`Respuesta inválida en ${inst.id}, ítem ${i + 1}`);
    }
    return itemValue(inst, i, optIdx);
  });
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function scoreInstrument(id: QuestionInstrumentId, answers: (number | null)[] | undefined) {
  const inst = INSTRUMENTS[id] as QuestionInstrument;
  const v = values(inst, answers);
  switch (id) {
    case "gad7":
    case "scoff":
    case "wurs25":
    case "eat26":
      return sum(v);
    case "pss10":
      return v.reduce((s, x, i) => s + (PSS_REVERSE.includes(i) ? 4 - x : x), 0);
    case "tmms24":
      return {
        atencion: sum(v.slice(0, 8)),
        claridad: sum(v.slice(8, 16)),
        reparacion: sum(v.slice(16, 24)),
      } satisfies TmmsScores;
    case "ipip50": {
      const out: number[] = [];
      for (let d = 0; d < 5; d++) {
        let s = 0;
        for (let i = d * 10; i < d * 10 + 10; i++) s += IPIP_REVERSE.includes(i) ? 6 - v[i] : v[i];
        out.push(s);
      }
      return out;
    }
    case "rosenberg":
      return v.reduce((s, x, i) => s + (ROSENBERG_REVERSE.includes(i) ? 5 - x : x), 0);
    case "asrs":
      return v.reduce((c, x, i) => c + (x >= ASRS_THRESHOLD[i] ? 1 : 0), 0);
  }
}

/** Sanea el resultado del juego de atención (viene del navegador, no es verificable). */
export function sanitizeCpt(raw: unknown): CptResult {
  const r = (raw ?? {}) as Record<string, unknown>;
  const targets = CPT_LETTERS.filter((l) => l === "X").length;
  const int = (x: unknown, max: number) => {
    const n = Math.round(Number(x));
    return Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0;
  };
  const hits = int(r.hits, targets);
  const avgRtRaw = Number(r.avgRt);
  return {
    hits,
    misses: int(r.misses, targets),
    falseAlarms: int(r.falseAlarms, CPT_LETTERS.length - targets),
    accuracy: Math.round((hits / targets) * 100),
    avgRt: hits > 0 && Number.isFinite(avgRtRaw) ? Math.min(CPT_TRIAL_MS, Math.max(0, Math.round(avgRtRaw))) : null,
  };
}

/** Calcula todos los puntajes de un pack. Lanza error si falta alguna respuesta. */
export function computeScores(instrumentIds: InstrumentId[], responses: Responses): Scores {
  const scores: Scores = {};
  for (const id of instrumentIds) {
    if (id === "cpt") {
      scores.cpt = sanitizeCpt(responses.cpt);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scores as any)[id] = scoreInstrument(id, responses[id]);
    }
  }
  return scores;
}

/* ---------- RANGOS MÁXIMOS ---------- */
export const MAX_SCORE: Record<string, number> = {
  gad7: 21,
  pss10: 40,
  eat26: 78,
  scoff: 5,
  rosenberg: 40,
  asrs: 6,
  wurs25: 100,
  tmms: 40,
  ipip: 50,
};

/* ---------- BANDAS Y TEXTOS PARA EL CLIENTE (lectura preliminar) ---------- */
export const clientBands = {
  gad7(s: number) {
    if (s <= 4) return { band: "Mínima", detail: "La ansiedad no parece estar interfiriendo de forma significativa en tu día a día." };
    if (s <= 9) return { band: "Leve", detail: "Es probable que notes momentos de nervios o preocupación, pero en general logras seguir con tus actividades sin mayor dificultad." };
    if (s <= 14) return { band: "Moderada", detail: "Es probable que cosas cotidianas como concentrarte en el trabajo, dormir bien o disfrutar un plan se vean afectadas varios días de la semana." };
    return { band: "Severa", detail: "Es probable que la ansiedad esté afectando de forma notoria tu funcionamiento diario — concentración, sueño, relaciones o energía. Esto amerita atención pronta." };
  },
  pss10(s: number) {
    if (s <= 13) return { band: "Baja", detail: "En general sientes que tienes las riendas de las exigencias de tu vida, aunque haya momentos puntuales de presión." };
    if (s <= 26) return { band: "Moderada", detail: "Hay temporadas en las que sientes que las cosas se te acumulan más de lo que quisieras — algo muy común, pero vale la pena notar los patrones que lo disparan." };
    return { band: "Alta", detail: "Sientes que las exigencias de tu vida superan tu capacidad de manejarlas en este momento. Esto suele mostrarse como cansancio, irritabilidad o dificultad para 'desconectar' incluso en tus espacios de descanso." };
  },
  eat26(s: number) {
    return s >= 20
      ? { band: "Riesgo — amerita evaluación adicional", detail: "Tus respuestas sugieren que la comida y tu cuerpo ocupan un espacio importante y probablemente incómodo en tu día a día — por ejemplo, pensar mucho en calorías, sentir culpa después de comer, o notar que la comida influye en decisiones sociales. Esto amerita una conversación con un profesional especializado." }
      : { band: "Sin señales de riesgo elevado", detail: "No se identifican señales de una relación especialmente conflictiva con la comida o tu cuerpo en este momento, más allá de preocupaciones comunes." };
  },
  scoff(s: number) {
    return s >= 2
      ? { band: "Tamizaje positivo — amerita evaluación adicional", detail: "Marcaste 2 o más señales de alerta directa (como inducir el vómito, sentir pérdida de control con la comida, o pérdida de peso reciente importante). Este resultado, solo o junto con el EAT-26, es motivo suficiente para buscar una evaluación profesional pronto." }
      : { band: "Tamizaje negativo", detail: "No se identificaron señales directas de alerta en este cuestionario corto." };
  },
  rosenberg(s: number) {
    if (s <= 19) return { band: "Baja", detail: "Es probable que te cueste reconocer tus propias cualidades y que la autocrítica aparezca con facilidad, incluso cuando las cosas te salen bien." };
    if (s <= 29) return { band: "Media", detail: "Tienes una valoración de ti mismo/a relativamente estable, con momentos de duda como le pasa a la mayoría." };
    return { band: "Alta", detail: "Tienes una base sólida de valoración personal, lo cual suele ser un buen recurso protector frente a la crítica externa o los reveses." };
  },
  asrs(s: number) {
    return s >= 4
      ? { band: "Tamizaje positivo — amerita evaluación adicional", detail: "Marcaste 4 o más de los 6 indicadores clave — cosas como dejar tareas a medias, perder el hilo de citas u obligaciones, o sentirte 'empujado/a por un motor'. Esto es compatible con síntomas actuales relevantes de TDAH." }
      : { band: "Tamizaje negativo", detail: "No se alcanza el umbral de síntomas actuales relevantes en este tamizaje corto." };
  },
  wurs25(s: number) {
    return s >= 46
      ? { band: "Elevado — compatible con síntomas significativos en la infancia", detail: "Tu puntaje sugiere que de niño/a mostrabas varios síntomas compatibles con TDAH (dificultad para concentrarte, impulsividad, problemas de conducta o bajo rendimiento). Combinado con síntomas actuales, esto fortalece la posibilidad de un diagnóstico si se confirma con evaluación completa." }
      : { band: "No elevado", detail: "No se identifica un patrón retrospectivo significativo de síntomas de TDAH en la infancia." };
  },
};

export type TmmsDim = keyof TmmsScores;
export const TMMS_DIMS: [TmmsDim, string][] = [
  ["atencion", "Atención"],
  ["claridad", "Claridad"],
  ["reparacion", "Reparación"],
];

export function bandTmms(s: number) {
  return s <= 16 ? "Baja" : s <= 29 ? "Media" : "Alta";
}

const TMMS_DETAIL: Record<TmmsDim, Record<string, string>> = {
  atencion: {
    Baja: "Sueles pasar por alto lo que sientes hasta que la emoción ya es fuerte.",
    Media: "Notas tus emociones sin quedarte atrapado/a pensando demasiado en ellas — un punto de equilibrio saludable.",
    Alta: "Le prestas mucha atención a lo que sientes; si esto se vuelve rumiación constante, puede alimentar más ansiedad en vez de ayudarte a manejarla.",
  },
  claridad: {
    Baja: "A veces sientes 'algo raro' pero te cuesta identificar si es ansiedad, tristeza, cansancio u otra cosa — eso dificulta saber qué hacer con ello.",
    Media: "Generalmente logras identificar qué estás sintiendo, aunque algunas emociones te resulten más confusas que otras.",
    Alta: "Tienes bastante claridad sobre lo que sientes en cada momento, lo cual facilita mucho poder actuar en consecuencia.",
  },
  reparacion: {
    Baja: "Hoy cuentas con pocas estrategias para regular cómo te sientes una vez que una emoción incómoda aparece — esto puede hacer que la ansiedad o el estrés 'se queden' más tiempo.",
    Media: "Tienes algunas herramientas para manejar emociones difíciles, aunque no siempre te funcionan igual de bien.",
    Alta: "Cuentas con buenos recursos para regular tu estado de ánimo cuando las cosas se complican — esto juega a tu favor frente a la ansiedad y el estrés.",
  },
};
export function tmmsDetail(dim: TmmsDim, s: number) {
  return TMMS_DETAIL[dim][bandTmms(s)];
}

export function bandIpip(s: number) {
  return s <= 23 ? "Bajo" : s <= 37 ? "Medio" : "Alto";
}
const IPIP_DETAIL: Record<string, string>[] = [
  { Bajo: "Prefieres espacios tranquilos y grupos pequeños; socializar mucho te puede resultar agotador, no aburrido.", Medio: "Te adaptas bien tanto a estar en grupo como a estar solo/a, según el momento.", Alto: "Te energizas estando con otras personas y sueles tomar la iniciativa en lo social." },
  { Bajo: "Eres más directo/a y analítico/a en tus relaciones; la armonía no siempre es tu prioridad número uno.", Medio: "Equilibras tus propias necesidades con las de los demás sin dificultad especial.", Alto: "Te resulta natural priorizar el bienestar de otros y evitar el conflicto." },
  { Bajo: "La estructura y la planeación rígida no son lo tuyo; funcionas mejor con flexibilidad.", Medio: "Cumples lo que te propones sin necesitar un sistema demasiado estricto.", Alto: "Eres metódico/a y confiable con tus compromisos — cuida no caer en perfeccionismo excesivo." },
  { Bajo: "Sientes las emociones con intensidad y te afectan los cambios; esto no es debilidad, pero sí vale la pena tener buenas herramientas de regulación.", Medio: "En general mantienes la calma, con altibajos normales ante el estrés.", Alto: "Te recuperas rápido de los contratiempos y mantienes estabilidad emocional incluso bajo presión." },
  { Bajo: "Prefieres lo concreto y probado sobre lo abstracto o experimental — eres práctico/a.", Medio: "Te interesan las ideas nuevas sin que eso reemplace tu lado práctico.", Alto: "Disfrutas explorar ideas, posibilidades y conversaciones abstractas." },
];
export function ipipDetail(domainIdx: number, s: number) {
  return IPIP_DETAIL[domainIdx][bandIpip(s)];
}

/* ---------- RIESGO ---------- */
/** Umbrales de riesgo elevado por instrumento (notificación prioritaria, no urgente). */
export function elevatedFlags(scores: Scores): string[] {
  const flags: string[] = [];
  if (scores.gad7 !== undefined && scores.gad7 >= 15) flags.push(`GAD-7 = ${scores.gad7} (ansiedad severa, ≥15)`);
  if (scores.pss10 !== undefined && scores.pss10 >= 27) flags.push(`PSS-10 = ${scores.pss10} (estrés alto, ≥27)`);
  if (scores.eat26 !== undefined && scores.eat26 >= 20) flags.push(`EAT-26 = ${scores.eat26} (riesgo TCA, ≥20)`);
  if (scores.scoff !== undefined && scores.scoff >= 2) flags.push(`SCOFF = ${scores.scoff} (tamizaje positivo, ≥2)`);
  if (scores.asrs !== undefined && scores.asrs >= 4) flags.push(`ASRS = ${scores.asrs} (tamizaje positivo, ≥4)`);
  if (scores.wurs25 !== undefined && scores.wurs25 >= 46) flags.push(`WURS-25 = ${scores.wurs25} (elevado, ≥46)`);
  return flags;
}

export type RiskLevel = "normal" | "elevado" | "crisis";

export function riskLevel(scores: Scores, safetyYes: boolean): RiskLevel {
  if (safetyYes) return "crisis";
  return elevatedFlags(scores).length > 0 ? "elevado" : "normal";
}

