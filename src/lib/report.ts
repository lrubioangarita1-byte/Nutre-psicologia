/**
 * Borrador automático del informe (misma lógica de puntajes del generador interno, con textos dirigidos al cliente)
 * y plantilla HTML del correo que recibe el cliente.
 */
import { IPIP_DOMAINS, MAX_SCORE, TMMS_DIMS, bandIpip, bandTmms, ipipDetail, type Scores, type TmmsDim } from "./instruments";
import { PACKS, RISKY, pct, type PackId } from "./packs";
import { BRAND } from "./brand";

export type ReportLine = { label?: string; score: string; pct: number; risky: boolean; band: string; tip: string };
export type ReportInstrument = { title: string; lines: ReportLine[]; note?: string };
export type Exercise = { title: string; text: string };

export type ReportDraft = {
  clientName: string;
  packId: PackId;
  packName: string;
  referredBy: string | null;
  instruments: ReportInstrument[];
  summary: string;
  exercises: Exercise[];
  recommendations: string;
};

/* ---------- Bandas + textos dirigidos al cliente ----------
 * Todos los textos del informe le hablan directamente a la persona evaluada (tú),
 * en tono cálido, sin diagnosticar y sin jerga clínica. Laura puede editarlos en el panel.
 */
export function bandGAD(s: number) { return s <= 4 ? "Mínima" : s <= 9 ? "Leve" : s <= 14 ? "Moderada" : "Severa"; }
export function tipGAD(s: number) {
  return ({
    Mínima: "Tu nivel de ansiedad está en un rango bajo. Mantener tus rutinas de autocuidado —dormir bien, moverte y hacer pausas— te ayudará a conservarlo así.",
    Leve: "Hay algo de ansiedad presente, pero en un nivel manejable. Herramientas sencillas, como la respiración pausada y organizar mejor tus tiempos, pueden evitar que aumente.",
    Moderada: "La ansiedad está ocupando un espacio importante en tu día a día. Un proceso breve con un/a psicólogo/a puede darte herramientas concretas para manejarla: no tienes que resolverlo sin apoyo.",
    Severa: "La ansiedad está afectando de forma notoria tu bienestar. Te recomiendo buscar acompañamiento profesional pronto; si además te está costando dormir, trabajar o cumplir con tu día, una valoración médica también puede ayudarte.",
  } as Record<string, string>)[bandGAD(s)];
}
export function bandPSS(s: number) { return s <= 13 ? "Baja" : s <= 26 ? "Moderada" : "Alta"; }
export function tipPSS(s: number) {
  return ({
    Baja: "En general sientes que puedes con las exigencias de tu vida. Es un buen momento para consolidar los hábitos que te están funcionando.",
    Moderada: "Hay momentos en que las exigencias se te acumulan. Identificar qué situaciones disparan más tu estrés te permitirá anticiparte y responder mejor.",
    Alta: "Ahora mismo sientes que las exigencias te superan. Vale la pena revisar qué cargas puedes soltar, delegar o posponer, y buscar apoyo profesional si esta sensación se mantiene.",
  } as Record<string, string>)[bandPSS(s)];
}
export function tipTMMS(dim: TmmsDim, s: number) {
  const m: Record<TmmsDim, Record<string, string>> = {
    atencion: {
      Baja: "Sueles darte cuenta de lo que sientes cuando la emoción ya es intensa. Dedicar unos minutos al día a preguntarte «¿cómo me siento?» te ayudará a notarlo antes.",
      Media: "Prestas atención a tus emociones en una medida saludable: las notas sin quedarte atrapado/a en ellas.",
      Alta: "Le prestas mucha atención a lo que sientes. Es valioso, pero cuida que no se convierta en darle vueltas constantemente: a veces basta con notar la emoción y dejarla pasar.",
    },
    claridad: {
      Baja: "A veces te cuesta ponerle nombre a lo que sientes. Ampliar tu vocabulario emocional (¿es tristeza, cansancio, frustración?) te ayudará a saber qué necesitas en cada momento.",
      Media: "En general identificas lo que sientes, aunque algunas emociones te resulten más confusas. Seguir practicando ponerles nombre te dará aún más claridad.",
      Alta: "Tienes claridad sobre lo que sientes, y esa es una gran fortaleza para tomar buenas decisiones sobre cómo cuidarte.",
    },
    reparacion: {
      Baja: "Cuando aparece una emoción difícil, hoy cuentas con pocas herramientas para recuperarte. Es la habilidad que más te conviene fortalecer, y se puede aprender: los ejercicios de este informe son un buen comienzo.",
      Media: "Tienes algunas estrategias para recuperarte de las emociones difíciles. Ampliar ese repertorio te dará más opciones cuando una no funcione.",
      Alta: "Sabes recuperarte cuando las cosas se complican. Es un recurso protector muy valioso: sigue cultivándolo.",
    },
  };
  return m[dim][bandTmms(s)];
}
export function bandEAT(s: number) { return s >= 20 ? "Señales de riesgo — conviene una evaluación especializada" : s >= 11 ? "Zona de atención" : "Sin señales de riesgo"; }
export function tipEAT(s: number) {
  if (s >= 20) return "Tus respuestas muestran que la comida y tu cuerpo ocupan un espacio importante, y probablemente incómodo, en tu día a día. Te recomiendo consultar pronto con un/a profesional especializado/a en conducta alimentaria: entre más temprano se aborda, más sencillo suele ser el proceso.";
  if (s >= 11) return "Aparecen algunas preocupaciones por la comida o por tu cuerpo, sin llegar a un nivel de riesgo. Vale la pena prestarles atención y conversarlas con un/a profesional antes de que crezcan.";
  return "No aparecen señales de riesgo en tu relación con la comida. Seguir cultivando una relación amable con la comida y con tu cuerpo es la mejor prevención.";
}
export function bandSCOFF(s: number) { return s >= 2 ? "Señales de alerta presentes" : "Sin señales de alerta"; }
export function tipSCOFF(s: number) {
  return s >= 2
    ? "Marcaste dos o más señales de alerta. Por sí solas no son un diagnóstico, pero sí son motivo suficiente para buscar una valoración profesional pronto."
    : "No marcaste señales de alerta en este cuestionario corto.";
}
export function bandASRS(s: number) { return s >= 4 ? "Síntomas actuales relevantes" : s >= 2 ? "Algunos síntomas presentes" : "Sin síntomas relevantes"; }
export function tipASRS(s: number) {
  if (s >= 4) return "Tus respuestas muestran dificultades actuales de atención, organización o inquietud que coinciden con lo que suele verse en el TDAH adulto. Esto no es un diagnóstico, pero sí justifica una evaluación completa que revise también cómo te afecta en el trabajo, el estudio y tus relaciones.";
  if (s >= 2) return "Aparecen algunas dificultades de atención u organización, sin alcanzar el umbral de este tamizaje. Si sientes que te están afectando, vale la pena conversarlo con un/a profesional.";
  return "No aparecen dificultades de atención relevantes en este tamizaje.";
}
export function bandWURS(s: number) { return s >= 46 ? "Rasgos marcados en la infancia" : s >= 30 ? "Algunos indicios en la infancia" : "Sin indicios relevantes"; }
export function tipWURS(s: number) {
  if (s >= 46) return "Tus recuerdos de la infancia muestran varios rasgos que suelen acompañar al TDAH. Este dato es importante para una evaluación completa, porque el TDAH en adultos casi siempre tiene raíces en la niñez.";
  if (s >= 30) return "Recuerdas algunos rasgos de inquietud o distracción en tu infancia, sin llegar al umbral. En una evaluación más completa vale la pena repasar con calma tu historia escolar y familiar.";
  return "No aparecen rasgos relevantes de TDAH en tu infancia según este cuestionario.";
}
export function bandRosenberg(s: number) { return s <= 19 ? "Baja" : s <= 29 ? "Media" : "Alta"; }
export function tipRosenberg(s: number) {
  return ({
    Baja: "Es probable que seas muy exigente contigo mismo/a y te cueste reconocer tus cualidades. La autoestima se puede fortalecer: los ejercicios de este informe y, si lo necesitas, un proceso terapéutico pueden ayudarte a entender de dónde viene esa voz crítica.",
    Media: "Tienes una valoración de ti mismo/a bastante estable, con momentos de duda como le pasa a la mayoría. Observa en qué situaciones baja más tu confianza: ahí está tu mejor oportunidad de crecimiento.",
    Alta: "Tienes una base sólida de valoración personal, un recurso que te protege frente a las críticas y los tropiezos. Cuídala, y recuerda que también está bien recibir retroalimentación sin sentirla como un ataque.",
  } as Record<string, string>)[bandRosenberg(s)];
}

/* ---------- Banco de ejercicios prácticos ---------- */
export const EXERCISES: Record<string, Exercise> = {
  respiracion478: { title: "Respiración 4-7-8", text: "Inhala por la nariz contando hasta 4, sostén el aire contando hasta 7, y exhala lentamente por la boca contando hasta 8. Repite 4 veces. Le avisa a tu cuerpo que puede calmarse y baja las sensaciones físicas de la ansiedad en pocos minutos." },
  grounding54321: { title: "Técnica 5-4-3-2-1 (anclaje sensorial)", text: "Nombra mentalmente 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes oír, 2 que puedes oler y 1 que puedes saborear. Te ayuda a salir de los pensamientos que dan vueltas y a volver al presente cuando la ansiedad se dispara con fuerza." },
  pausasActivas: { title: "Pausas activas programadas", text: "Programa 3 alarmas al día (ej. 10am, 1pm, 4pm) para detenerte 2 minutos: estirarte, respirar o mirar por la ventana. El estrés se acumula más por falta de pausas que por la carga en sí." },
  stop: { title: "Técnica STOP", text: "Cuando notes malestar: S-detente, T-toma un respiro, O-observa qué sientes y piensas, P-procede con una acción consciente. Te ayuda a salir del piloto automático que mantiene el estrés." },
  diarioEmociones: { title: "Diario de emociones de 3 líneas", text: "Cada noche escribe 3 líneas: qué sentiste hoy, qué lo disparó, y qué hiciste con eso. No busca resolver nada — entrena la claridad emocional con el tiempo." },
  registroLogros: { title: "Registro diario de logros", text: "Anota cada noche 3 cosas que hiciste bien hoy, por pequeñas que sean. Entrena tu mirada para notar lo que haces bien, no solo lo que te falta." },
  autocompasion: { title: "Carta de autocompasión", text: "Escríbete una carta breve como si fueras tu mejor amigo/a hablándote sobre algo que te cuesta. Suaviza la autocrítica y mejora la relación contigo mismo/a." },
  pensamientosCuerpo: { title: "Registro de pensamientos sobre el cuerpo", text: "Cuando aparezca un pensamiento crítico sobre tu cuerpo, anótalo junto con la situación que lo disparó. No busca cambiarlo de inmediato, sino ayudarte a notar cuándo y por qué aparece." },
  redApoyo: { title: "Un mensaje a tu red de apoyo", text: "Elige a una persona de confianza y cuéntale, aunque sea brevemente, cómo te has sentido esta semana. Romper el aislamiento es uno de los factores protectores más importantes." },
  pomodoroTDAH: { title: "Pomodoro adaptado (25/5)", text: "Trabaja 25 minutos en una sola tarea con el celular fuera de la vista, luego descansa 5. Reduce la fricción de iniciar tareas que cuesta arrancar." },
  recordatoriosExternos: { title: "Sistema de recordatorios visibles", text: "En vez de confiar en la memoria, usa notas visibles o alarmas en los lugares donde realmente actúas. Externalizar la organización compensa la dificultad para sostenerla mentalmente." },
  movimientoPrevio: { title: "Movimiento antes de concentrarte", text: "Antes de una tarea que requiere atención sostenida, muévete 5 minutos (caminar, estirar, subir escaleras). Canaliza la activación física antes de sentarte a trabajar." },
  general_autocuidado: { title: "Rutina mínima de autocuidado", text: "Elige una sola cosa (dormir 30 min más, una caminata corta, un espacio sin pantallas) y hazla todos los días esta semana. Los cambios pequeños y sostenidos suelen rendir más que los grandes cambios puntuales." },
};

export function pickExercises(packId: PackId, s: Scores): Exercise[] {
  let keys: string[] = [];
  if (packId === "ansiedad") {
    const gad = s.gad7 ?? 0, pss = s.pss10 ?? 0, re = s.tmms24?.reparacion ?? 40;
    if (gad >= 10) keys.push("respiracion478");
    if (gad >= 15) keys.push("grounding54321");
    if (pss >= 27) keys.push("stop");
    else if (pss >= 14) keys.push("pausasActivas");
    if (re <= 29) keys.push("diarioEmociones");
    keys.push("general_autocuidado");
  } else if (packId === "alimentacion") {
    keys = ["pensamientosCuerpo", "autocompasion", "redApoyo"];
  } else if (packId === "quiensoy") {
    const ros = s.rosenberg ?? 40, re = s.tmms24?.reparacion ?? 40;
    if (ros <= 29) keys.push("registroLogros", "autocompasion");
    if (re <= 29) keys.push("diarioEmociones");
    keys.push("general_autocuidado");
  } else if (packId === "tdah" || packId === "atencion") {
    keys = ["pomodoroTDAH", "recordatoriosExternos", "movimientoPrevio"];
  } else if (packId === "emocional") {
    const t = s.tmms24;
    if (t && t.reparacion <= 29) keys.push("stop");
    if (t && (t.claridad <= 29 || t.atencion <= 16)) keys.push("diarioEmociones");
    keys.push("respiracion478", "general_autocuidado");
  } else if (packId === "personalidad") {
    keys = ["diarioEmociones", "registroLogros", "general_autocuidado"];
  }
  const unique = [...new Set(keys)];
  // Completar hasta 3 con ejercicios generales que no se repitan
  for (const k of ["general_autocuidado", "redApoyo", "diarioEmociones"]) {
    if (unique.length >= 3) break;
    if (!unique.includes(k)) unique.push(k);
  }
  return unique.slice(0, 3).map((k) => ({ ...EXERCISES[k] }));
}

/* ---------- Borrador ---------- */
function single(title: string, s: number, max: number, band: string, risky: boolean, tip: string): ReportInstrument {
  return { title, lines: [{ score: `${s} / ${max}`, pct: pct(s, max), risky, band, tip }] };
}

function tmmsBlock(t: NonNullable<Scores["tmms24"]>): ReportInstrument {
  return {
    title: "TMMS-24 — Inteligencia emocional",
    lines: TMMS_DIMS.map(([k, label]) => ({
      label,
      score: `${t[k]} / 40`,
      pct: pct(t[k], 40),
      risky: k === "reparacion" && t[k] <= 16,
      band: bandTmms(t[k]),
      tip: tipTMMS(k, t[k]),
    })),
  };
}

const TRAIT_NAMES = ["la extraversión", "la amabilidad", "la responsabilidad", "la estabilidad emocional", "la apertura a nuevas ideas"];

function reparacionText(re: number) {
  const b = bandTmms(re);
  if (b === "Alta") return "Tu capacidad para recuperarte de las emociones difíciles es una fortaleza que amortigua mucho el impacto de lo demás.";
  if (b === "Media") return "Cuentas con algunas herramientas para recuperarte cuando aparece el malestar, y ampliarlas es tu mejor oportunidad de mejora.";
  return "Hoy te cuesta recuperarte cuando aparece el malestar, y eso hace que la ansiedad y el estrés se queden más tiempo; por eso los ejercicios de este informe se enfocan en esa habilidad.";
}

const bullets = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");

function ipipBlock(d: number[]): ReportInstrument {
  return {
    title: "IPIP-50 — Los cinco grandes rasgos de personalidad",
    lines: IPIP_DOMAINS.map((label, i) => ({ label, score: `${d[i]} / 50`, pct: pct(d[i], 50), risky: false, band: bandIpip(d[i]), tip: ipipDetail(i, d[i]) })),
  };
}

function cptBlock(cpt: NonNullable<Scores["cpt"]>): ReportInstrument {
  return {
    title: "Prueba breve de atención",
    lines: [{
      score: `${cpt.accuracy}% de aciertos`,
      pct: cpt.accuracy,
      risky: cpt.accuracy < 70,
      band: `Tiempo de reacción promedio: ${cpt.avgRt ?? "—"} ms · Toques fuera de lugar: ${cpt.falseAlarms}`,
      tip: cpt.accuracy < 70
        ? "Tu desempeño en este ejercicio corto fue algo variable. Es solo un dato informal que complementa los cuestionarios y no se interpreta por sí solo."
        : "Tu desempeño en este ejercicio corto fue bueno. Es un dato informal que complementa los cuestionarios.",
    }],
    note: "Ejercicio ilustrativo, no una prueba neuropsicológica validada.",
  };
}

export function buildReportDraft(input: {
  packId: PackId;
  clientName: string;
  referredBy: string | null;
  scores: Scores;
}): ReportDraft {
  const { packId, scores: s } = input;
  const pack = PACKS[packId];
  const instruments: ReportInstrument[] = [];
  let summary = "";
  let recs: string[] = [];

  if (packId === "ansiedad") {
    const gad = s.gad7!, pss = s.pss10!, t = s.tmms24!;
    instruments.push(single("GAD-7 — Ansiedad", gad, 21, bandGAD(gad), RISKY.gad7(gad), tipGAD(gad)));
    instruments.push(single("PSS-10 — Estrés percibido", pss, 40, bandPSS(pss), RISKY.pss10(pss), tipPSS(pss)));
    instruments.push(tmmsBlock(t));
    const needsSupport = gad >= 10 || pss >= 27;
    summary =
      `Tus resultados muestran una ansiedad ${bandGAD(gad).toLowerCase()} y una percepción de estrés ${bandPSS(pss).toLowerCase()}. ${reparacionText(t.reparacion)}\n\n` +
      (needsSupport
        ? "Con lo que veo en tus respuestas, te recomiendo no cargar esto sin apoyo: un proceso breve con un/a psicólogo/a puede marcar una diferencia real en cómo te sientes."
        : "Con pequeños ajustes en tu rutina puedes mantener este equilibrio y estar más preparado/a para los momentos de mayor presión.");
    if (needsSupport) recs.push("Buscar acompañamiento con un/a psicólogo/a para trabajar el manejo de la ansiedad y el estrés.");
    if (gad >= 15) recs.push("Considerar también una valoración médica si la ansiedad está afectando tu sueño, tu apetito o tu capacidad de cumplir con tu día.");
    if (pss >= 14) recs.push("Identificar las dos o tres situaciones que más disparan tu estrés y pensar qué puedes soltar, delegar o anticipar.");
    recs.push("Practicar los ejercicios de este informe durante al menos dos semanas y observar qué cambia.");
    recs.push("Cuidar lo básico: horarios de sueño regulares, movimiento diario y espacios sin pantallas.");
  } else if (packId === "alimentacion") {
    const eat = s.eat26!, scoff = s.scoff!;
    instruments.push(single("EAT-26 — Actitudes alimentarias", eat, MAX_SCORE.eat26, bandEAT(eat), RISKY.eat26(eat), tipEAT(eat)));
    instruments.push(single("SCOFF — Señales de alerta", scoff, 5, bandSCOFF(scoff), RISKY.scoff(scoff), tipSCOFF(scoff)));
    if (eat >= 20 || scoff >= 2) {
      summary = "Tus respuestas muestran señales que conviene atender con un/a profesional especializado/a en conducta alimentaria. Esto no es un diagnóstico y no tienes por qué alarmarte: es una invitación a cuidarte a tiempo, porque entre más temprano se aborda, más sencillo suele ser el camino.";
      recs = [
        "Pedir una cita con un/a profesional especializado/a en conducta alimentaria (psicología y, si es posible, también nutrición).",
        "Si en algún momento vomitas, usas laxantes o haces ejercicio para «compensar» lo que comes, cuéntaselo a ese profesional: es información clave para ayudarte.",
        "Hablar con una persona de confianza sobre cómo te has sentido.",
      ];
    } else if (eat >= 11) {
      summary = "No aparecen señales de riesgo, aunque sí algunas preocupaciones por la comida o por tu cuerpo que vale la pena observar con cariño, antes de que crezcan.";
      recs = [
        "Observar en qué momentos aparecen esas preocupaciones (cansancio, estrés, comentarios de otros) para entender qué las dispara.",
        "Conversarlo con un/a psicólogo/a si notas que ocupan cada vez más espacio en tu día.",
      ];
    } else {
      summary = "No aparecen señales de riesgo en tu relación con la comida y con tu cuerpo. Es una buena base para seguir cuidándote.";
      recs = ["Seguir comiendo con flexibilidad y sin culpa, y tratar a tu cuerpo con la misma amabilidad que a alguien que quieres."];
    }
  } else if (packId === "quiensoy") {
    const d = s.ipip50!, t = s.tmms24!, ros = s.rosenberg!;
    instruments.push(ipipBlock(d));
    instruments.push(tmmsBlock(t));
    instruments.push(single("Rosenberg — Autoestima", ros, 40, bandRosenberg(ros), RISKY.rosenberg(ros), tipRosenberg(ros)));
    const top = TRAIT_NAMES[d.indexOf(Math.max(...d))];
    summary =
      `Tu rasgo de personalidad más marcado es ${top}, y tu autoestima está en un nivel ${bandRosenberg(ros).toLowerCase()}. ` +
      `En cuanto a tus emociones, ${tipTMMS("reparacion", t.reparacion).charAt(0).toLowerCase()}${tipTMMS("reparacion", t.reparacion).slice(1)}\n\n` +
      "Ningún rasgo de personalidad es bueno o malo en sí mismo: lo valioso es conocerte para elegir entornos, relaciones y metas que encajen contigo.";
    recs.push("Usar tu perfil para reconocer en qué tipo de entornos y tareas te sientes más tú.");
    if (ros <= 19) recs.push("Explorar en un proceso terapéutico de dónde viene tu autocrítica: la autoestima se puede fortalecer.");
    if (t.reparacion <= 16) recs.push("Aprender estrategias para recuperarte de las emociones difíciles, empezando por los ejercicios de este informe.");
    recs.push("Practicar los ejercicios de este informe durante al menos dos semanas.");
  } else if (packId === "tdah") {
    const asrs = s.asrs!, wurs = s.wurs25!, cpt = s.cpt;
    instruments.push(single("ASRS v1.1 — Síntomas actuales", asrs, 6, bandASRS(asrs), RISKY.asrs(asrs), tipASRS(asrs)));
    instruments.push(single("WURS-25 — Síntomas en la infancia", wurs, 100, bandWURS(wurs), RISKY.wurs25(wurs), tipWURS(wurs)));
    if (cpt) instruments.push(cptBlock(cpt));
    const now = asrs >= 4, past = wurs >= 46;
    summary =
      now && past
        ? "Tanto tus dificultades actuales como los recuerdos de tu infancia coinciden con un patrón compatible con TDAH. Esto no es un diagnóstico, pero sí es justo la combinación que una evaluación completa necesita confirmar o descartar, así que te recomiendo dar ese siguiente paso."
        : now || past
          ? `Aparecen señales ${now ? "en tu presente" : "en tu infancia"}, pero no en ambos momentos de tu vida. Esto no descarta nada: sugiere profundizar con calma antes de sacar conclusiones.`
          : "No aparece un patrón claro de TDAH ni en tu presente ni en tu infancia según este tamizaje. Si aun así sientes que la atención o la organización te están costando, vale la pena conversarlo con un/a profesional, porque pueden influir otros factores como el estrés, el sueño o el estado de ánimo.";
    if (now || past) {
      recs.push("Agendar una evaluación diagnóstica completa de TDAH en adultos con un/a profesional (psicología clínica, neuropsicología o psiquiatría).");
      recs.push("Llevar a esa cita este informe y, si los tienes, boletines o recuerdos de tu etapa escolar.");
    }
    recs.push("Probar las estrategias de organización de este informe: suelen ayudar con o sin diagnóstico.");
  } else if (packId === "atencion") {
    const asrs = s.asrs!;
    instruments.push(single("ASRS v1.1 — Tamizaje de atención en adultos", asrs, 6, bandASRS(asrs), RISKY.asrs(asrs), tipASRS(asrs)));
    summary = asrs >= 4
      ? "Tus respuestas muestran dificultades actuales de atención y organización que justifican mirar más a fondo. Este cuestionario es un primer filtro: una evaluación completa también revisa tu historia desde la infancia y cómo te afecta en el día a día."
      : "No se alcanza el umbral de este tamizaje. Si aun así sientes que la atención te está costando, vale la pena conversarlo con un/a profesional, porque pueden influir otros factores como el estrés, el sueño o el estado de ánimo.";
    if (asrs >= 4) recs.push("Considerar una evaluación completa de TDAH en adultos (por ejemplo, el pack «TDAH en adultos» o una consulta especializada).");
    recs.push("Probar las estrategias de organización de este informe durante dos semanas.");
  } else if (packId === "personalidad") {
    const d = s.ipip50!;
    instruments.push(ipipBlock(d));
    const top = TRAIT_NAMES[d.indexOf(Math.max(...d))];
    const low = TRAIT_NAMES[d.indexOf(Math.min(...d))];
    summary = `Tu rasgo más marcado es ${top} y el menos marcado es ${low}. Ningún rasgo es bueno o malo en sí mismo: cada combinación trae fortalezas distintas según el contexto, y conocerla te ayuda a elegir entornos, relaciones y metas que encajen contigo.`;
    recs = [
      "Reconocer en qué situaciones tu forma de ser es una fortaleza, y en cuáles te pide un esfuerzo extra.",
      "Compartir este perfil con alguien de confianza y preguntarle si se reconoce en él: suele abrir conversaciones muy valiosas.",
    ];
  } else if (packId === "emocional") {
    const t = s.tmms24!;
    instruments.push(tmmsBlock(t));
    summary =
      `Tu atención emocional es ${bandTmms(t.atencion).toLowerCase()}, tu claridad emocional es ${bandTmms(t.claridad).toLowerCase()} y tu capacidad para recuperarte de las emociones difíciles es ${bandTmms(t.reparacion).toLowerCase()}. ` +
      "Estas tres habilidades se entrenan con la práctica, como cualquier otra.";
    if (t.claridad <= 16) recs.push("Practicar ponerle nombre a lo que sientes cada día (el diario de emociones es una buena forma de empezar).");
    if (t.reparacion <= 16) recs.push("Aprender estrategias para recuperarte cuando aparece una emoción difícil; si te cuesta mucho, un proceso con un/a psicólogo/a puede ayudarte.");
    if (t.atencion >= 30) recs.push("Cuidar que la atención a tus emociones no se convierta en darles vueltas constantemente.");
    recs.push("Practicar los ejercicios de este informe durante al menos dos semanas.");
  }

  return {
    clientName: input.clientName,
    packId,
    packName: pack.name,
    referredBy: input.referredBy,
    instruments,
    summary,
    exercises: pickExercises(packId, s),
    recommendations: bullets(recs),
  };
}

/* ---------- HTML del correo ---------- */
export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
const nl2br = (s: string) => escapeHtml(s).replace(/\n/g, "<br>");

const C = { olive: "#5B5120", rose: "#DEACA9", roseSoft: "#EFD3D1", cream: "#FCEFDC", coral: "#EF6328", ink: "#3A3415", inkSoft: "#6B6135", line: "#E6D2B8" };
const serif = "'Playfair Display', Georgia, serif";
const sans = "'Quicksand', 'Helvetica Neue', Arial, sans-serif";

function gaugeHtml(p: number, risky: boolean) {
  const w = Math.max(1, Math.min(100, p));
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 4px;border-collapse:collapse"><tr>
<td width="${w}%" style="height:9px;background:${risky ? C.coral : C.olive};border-radius:5px 0 0 5px;font-size:0;line-height:0">&nbsp;</td>
${w < 100 ? `<td style="height:9px;background:${C.line};border-radius:0 5px 5px 0;font-size:0;line-height:0">&nbsp;</td>` : ""}
</tr></table>`;
}

export function renderReportHtml(d: ReportDraft, sentAt: Date): string {
  const date = sentAt.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Bogota" });
  const card = (inner: string) =>
    `<div style="background:#ffffff;border:1px solid ${C.line};border-radius:12px;padding:18px 20px;margin:0 0 14px">${inner}</div>`;
  const h3 = (t: string) => `<h3 style="font-family:${serif};color:${C.olive};font-size:19px;margin:26px 0 12px">${escapeHtml(t)}</h3>`;

  const instruments = d.instruments
    .map((inst) => {
      const lines = inst.lines
        .map((l) => `
<div style="margin-top:10px">
  <div style="font-family:${serif};font-weight:700;color:${C.coral};font-size:17px">${l.label ? escapeHtml(l.label) + ": " : ""}${escapeHtml(l.score)}</div>
  ${gaugeHtml(l.pct, l.risky)}
  <div style="font-size:13.5px;color:${C.inkSoft}">${escapeHtml(l.band)}</div>
  ${l.tip.trim() ? `<div style="font-size:14px;margin-top:6px">${nl2br(l.tip)}</div>` : ""}
</div>`)
        .join("");
      return card(
        `<div style="font-family:${serif};font-weight:700;color:${C.olive};font-size:16px;border-bottom:1px solid ${C.line};padding-bottom:8px">${escapeHtml(inst.title)}</div>${lines}${inst.note ? `<div style="font-size:12px;color:${C.inkSoft};margin-top:8px">${escapeHtml(inst.note)}</div>` : ""}`,
      );
    })
    .join("");

  const exercises = d.exercises
    .map((e, i) => card(`<div style="font-family:${serif};font-weight:700;color:${C.olive};font-size:16px;margin-bottom:6px">${i + 1}. ${escapeHtml(e.title)}</div><div style="font-size:14px">${nl2br(e.text)}</div>`))
    .join("");

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tu informe — ${escapeHtml(d.packName)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};color:${C.ink};font-family:${sans};line-height:1.6">
<div style="max-width:640px;margin:0 auto;padding:28px 18px">
  <div style="text-align:center;margin-bottom:20px">
    <div style="display:inline-block;width:46px;height:46px;line-height:46px;border-radius:50%;border:1px solid ${C.olive};font-family:${serif};font-style:italic;font-weight:600;color:${C.olive};font-size:20px">${escapeHtml(BRAND.monogram)}</div>
    <div style="font-family:${serif};font-weight:700;color:${C.olive};font-size:18px;margin-top:6px">${escapeHtml(BRAND.product)}</div>
    <div style="font-size:10px;letter-spacing:.14em;color:${C.inkSoft};font-weight:600">${escapeHtml(BRAND.endorsement.toUpperCase())}</div>
  </div>
  <div style="background:${C.olive};color:${C.cream};border-radius:12px;padding:20px 22px;font-size:13.5px;margin-bottom:22px">
    <b style="color:${C.rose}">Cliente:</b> ${escapeHtml(d.clientName)}<br>
    <b style="color:${C.rose}">Pack:</b> ${escapeHtml(d.packName)}<br>
    <b style="color:${C.rose}">Fecha:</b> ${escapeHtml(date)}<br>
    ${d.referredBy ? `<b style="color:${C.rose}">Remitido por:</b> ${escapeHtml(d.referredBy)}<br>` : ""}
    <b style="color:${C.rose}">Evaluación técnica realizada por:</b> ${escapeHtml(BRAND.fullName)} · Psicóloga · Tarjeta Profesional ${BRAND.tp}
  </div>
  <p style="font-size:15px">Hola ${escapeHtml(d.clientName.split(" ")[0] || d.clientName)}, gracias por tomarte el tiempo de responder. Este es tu informe personalizado, revisado y aprobado por mí.</p>
  ${h3("Resultados por instrumento")}
  ${instruments}
  ${h3("Interpretación integrada")}
  ${card(`<div style="font-size:14.5px">${nl2br(d.summary)}</div>`)}
  ${h3("3 ejercicios prácticos sugeridos")}
  ${exercises}
  ${h3("Recomendaciones")}
  ${card(`<div style="font-size:14.5px">${nl2br(d.recommendations)}</div>`)}
  <div style="background:${C.roseSoft};border-radius:12px;padding:16px 18px;font-size:13px;margin-top:20px">
    <b style="color:${C.coral}">Si en algún momento sientes que estás en crisis</b> o piensas en hacerte daño, comunícate de inmediato con la Línea 192, opción 4 (Colombia, 24 horas).
  </div>
  <div style="font-size:12px;color:${C.inkSoft};border-top:1px solid ${C.line};padding-top:14px;margin-top:22px">
    Este informe es el resultado de una evaluación puntual y orientativa, no constituye diagnóstico clínico definitivo ni reemplaza un proceso terapéutico. Los instrumentos aplicados son de tamizaje; cualquier decisión clínica debe apoyarse en el juicio profesional de quien atiende directamente a la persona evaluada${d.referredBy ? ` (${escapeHtml(d.referredBy)})` : ""}.<br><br>
    <b>${escapeHtml(BRAND.fullName)}</b> — Psicóloga · Tarjeta Profesional ${BRAND.tp}<br>
    ${escapeHtml(BRAND.email)}
  </div>
</div></body></html>`;
}
