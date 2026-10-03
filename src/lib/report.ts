/**
 * Borrador automático del informe (misma lógica del generador interno de informes)
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

/* ---------- Bandas clínicas + consejos ---------- */
export function bandGAD(s: number) { return s <= 4 ? "Mínima" : s <= 9 ? "Leve" : s <= 14 ? "Moderada" : "Severa"; }
export function tipGAD(s: number) {
  return ({
    Mínima: "Mantener buenas rutinas de autocuidado (sueño, ejercicio, pausas) como prevención.",
    Leve: "Técnicas de respiración y manejo del tiempo pueden ayudar a que no escale.",
    Moderada: "Vale la pena iniciar un proceso terapéutico breve enfocado en manejo de ansiedad.",
    Severa: "Se recomienda evaluación profesional prioritaria; considerar también valoración psiquiátrica si hay impacto funcional importante.",
  } as Record<string, string>)[bandGAD(s)];
}
export function bandPSS(s: number) { return s <= 13 ? "Baja" : s <= 26 ? "Moderada" : "Alta"; }
export function tipPSS(s: number) {
  return ({
    Baja: "Buen momento para consolidar hábitos de manejo del estrés como prevención.",
    Moderada: "Identificar los disparadores principales de estrés y trabajar estrategias puntuales de afrontamiento.",
    Alta: "Priorizar reducción de carga donde sea posible y considerar apoyo profesional si persiste.",
  } as Record<string, string>)[bandPSS(s)];
}
export function tipTMMS(dim: TmmsDim, s: number) {
  const m: Record<TmmsDim, Record<string, string>> = {
    atencion: { Baja: "Practicar ejercicios de registro emocional diario (ej. diario de emociones).", Media: "Buen punto de partida; reforzar sin caer en rumiación.", Alta: "Trabajar en no quedarse 'enganchado/a' analizando de más lo que siente." },
    claridad: { Baja: "Trabajar vocabulario emocional y ejercicios de identificación de emociones.", Media: "Reforzar con psicoeducación emocional básica.", Alta: "Buen recurso a capitalizar en el proceso terapéutico." },
    reparacion: { Baja: "Foco principal de intervención: enseñar estrategias de regulación emocional (respiración, reestructuración cognitiva, etc.).", Media: "Ampliar el repertorio de estrategias de regulación ya existentes.", Alta: "Recurso protector importante; reforzar y mantener." },
  };
  return m[dim][bandTmms(s)];
}
export function bandEAT(s: number) { return s >= 20 ? "Riesgo — amerita evaluación adicional" : s >= 11 ? "Zona de vigilancia" : "Sin señales de riesgo elevado"; }
export function tipEAT(s: number) {
  if (s >= 20) return "Priorizar remisión a evaluación especializada en TCA. Explorar con cuidado conductas compensatorias (purgas, laxantes, ejercicio compulsivo) en la entrevista clínica.";
  if (s >= 11) return "Sin cumplir el umbral de riesgo, hay preocupaciones relevantes por la comida/cuerpo que vale la pena explorar en sesión antes de que escalen.";
  return "Reforzar hábitos saludables de relación con la comida y el cuerpo como prevención general.";
}
export function bandSCOFF(s: number) { return s >= 2 ? "Tamizaje positivo" : "Tamizaje negativo"; }
export function tipSCOFF(s: number) {
  return s >= 2 ? "Confirmar con entrevista clínica estructurada; no demorar la remisión si el EAT-26 también sale elevado." : "Sin señales adicionales por este instrumento corto.";
}
export function bandASRS(s: number) { return s >= 4 ? "Tamizaje positivo" : s >= 2 ? "Zona límite" : "Tamizaje negativo"; }
export function tipASRS(s: number) {
  if (s >= 4) return "Compatible con síntomas actuales relevantes; considerar evaluación estructurada (ej. DIVA-5) y explorar impacto funcional (trabajo, estudio, relaciones).";
  if (s >= 2) return "No alcanza el umbral, pero hay síntomas presentes — vale la pena preguntar directamente por el impacto funcional antes de descartar.";
  return "Sin síntomas actuales significativos por este tamizaje.";
}
export function bandWURS(s: number) { return s >= 46 ? "Elevado" : s >= 30 ? "Zona intermedia" : "No elevado"; }
export function tipWURS(s: number) {
  if (s >= 46) return "Compatible con síntomas significativos desde la infancia; suma evidencia relevante para una evaluación diagnóstica completa.";
  if (s >= 30) return "Hay indicios retrospectivos que no llegan al umbral — explorar con más detalle la historia escolar y familiar en la entrevista.";
  return "Sin síntomas retrospectivos significativos.";
}
export function bandRosenberg(s: number) { return s <= 19 ? "Baja" : s <= 29 ? "Media" : "Alta"; }
export function tipRosenberg(s: number) {
  return ({
    Baja: "Trabajar autoconcepto y autocompasión; explorar el origen de la autocrítica (familiar, social, experiencias tempranas).",
    Media: "Reforzar recursos existentes; identificar en qué contextos específicos baja más la autoestima.",
    Alta: "Buen recurso protector — reforzar y mantener, cuidando que no se convierta en rigidez ante la crítica.",
  } as Record<string, string>)[bandRosenberg(s)];
}

/* ---------- Banco de ejercicios prácticos ---------- */
export const EXERCISES: Record<string, Exercise> = {
  respiracion478: { title: "Respiración 4-7-8", text: "Inhala por la nariz contando hasta 4, sostén el aire contando hasta 7, y exhala lentamente por la boca contando hasta 8. Repite 4 veces. Activa el sistema nervioso parasimpático y ayuda a bajar la activación física de la ansiedad en pocos minutos." },
  grounding54321: { title: "Técnica 5-4-3-2-1 (anclaje sensorial)", text: "Nombra mentalmente 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes oír, 2 que puedes oler y 1 que puedes saborear. Ayuda a salir de la rumiación y volver al presente cuando la ansiedad se dispara con fuerza." },
  pausasActivas: { title: "Pausas activas programadas", text: "Programa 3 alarmas al día (ej. 10am, 1pm, 4pm) para detenerte 2 minutos: estirarte, respirar o mirar por la ventana. El estrés se acumula más por falta de pausas que por la carga en sí." },
  stop: { title: "Técnica STOP", text: "Cuando notes malestar: S-detente, T-toma un respiro, O-observa qué sientes y piensas, P-procede con una acción consciente. Interrumpe el piloto automático que mantiene el estrés." },
  diarioEmociones: { title: "Diario de emociones de 3 líneas", text: "Cada noche escribe 3 líneas: qué sentiste hoy, qué lo disparó, y qué hiciste con eso. No busca resolver nada — entrena la claridad emocional con el tiempo." },
  registroLogros: { title: "Registro diario de logros", text: "Anota cada noche 3 cosas que hiciste bien hoy, por pequeñas que sean. Contrarresta el sesgo de autocrítica que mantiene baja la autoestima." },
  autocompasion: { title: "Carta de autocompasión", text: "Escríbete una carta breve como si fueras tu mejor amigo/a hablándote sobre algo que te cuesta. Suaviza la autocrítica y mejora la relación contigo mismo/a." },
  pensamientosCuerpo: { title: "Registro de pensamientos sobre el cuerpo", text: "Cuando aparezca un pensamiento crítico sobre tu cuerpo, anótalo junto con la situación que lo disparó. No busca cambiarlo de inmediato, sino notar el patrón antes de trabajarlo en terapia." },
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

export function buildReportDraft(input: {
  packId: PackId;
  clientName: string;
  referredBy: string | null;
  scores: Scores;
}): ReportDraft {
  const { packId, scores: s } = input;
  const pack = PACKS[packId];
  const instruments: ReportInstrument[] = [];
  let tips: string[] = [];

  if (packId === "ansiedad") {
    const gad = s.gad7!, pss = s.pss10!, t = s.tmms24!;
    instruments.push(single("GAD-7 — Ansiedad", gad, 21, bandGAD(gad), RISKY.gad7(gad), tipGAD(gad)));
    instruments.push(single("PSS-10 — Estrés percibido", pss, 40, bandPSS(pss), RISKY.pss10(pss), tipPSS(pss)));
    instruments.push(tmmsBlock(t));
    tips = [tipGAD(gad), tipPSS(pss), tipTMMS("reparacion", t.reparacion)];
  } else if (packId === "alimentacion") {
    const eat = s.eat26!, scoff = s.scoff!;
    instruments.push(single("EAT-26 — Actitudes alimentarias", eat, MAX_SCORE.eat26, bandEAT(eat), RISKY.eat26(eat), tipEAT(eat)));
    instruments.push(single("SCOFF — Tamizaje TCA", scoff, 5, bandSCOFF(scoff), RISKY.scoff(scoff), tipSCOFF(scoff)));
    tips = [eat >= 20 || scoff >= 2 ? "Se recomienda evaluación clínica especializada en TCA a la brevedad." : "No se identifican señales de alarma relevantes por ahora."];
  } else if (packId === "quiensoy") {
    const d = s.ipip50!, t = s.tmms24!, ros = s.rosenberg!;
    instruments.push({
      title: "IPIP-50 — Los cinco grandes",
      lines: IPIP_DOMAINS.map((label, i) => ({ label, score: `${d[i]} / 50`, pct: pct(d[i], 50), risky: false, band: bandIpip(d[i]), tip: ipipDetail(i, d[i]) })),
    });
    instruments.push(tmmsBlock(t));
    instruments.push(single("Rosenberg — Autoestima", ros, 40, bandRosenberg(ros), RISKY.rosenberg(ros), tipRosenberg(ros)));
    tips = ["Perfil de personalidad orientativo para autoconocimiento.", tipTMMS("reparacion", t.reparacion)];
  } else if (packId === "tdah") {
    const asrs = s.asrs!, wurs = s.wurs25!, cpt = s.cpt;
    instruments.push(single("ASRS v1.1", asrs, 6, bandASRS(asrs), RISKY.asrs(asrs), tipASRS(asrs)));
    instruments.push(single("WURS-25", wurs, 100, bandWURS(wurs), RISKY.wurs25(wurs), tipWURS(wurs)));
    if (cpt) {
      instruments.push({
        title: "Prueba breve de atención",
        lines: [{
          score: `${cpt.accuracy}% de aciertos`,
          pct: cpt.accuracy,
          risky: cpt.accuracy < 70,
          band: `Tiempo de reacción promedio: ${cpt.avgRt ?? "—"} ms · Toques fuera de lugar: ${cpt.falseAlarms}`,
          tip: cpt.accuracy < 70
            ? "El desempeño en este ejercicio corto fue más variable de lo esperado — puede ser un dato adicional a considerar junto con los demás, sin sobreinterpretarlo por sí solo."
            : "El desempeño en este ejercicio corto fue razonable — un dato adicional informal que complementa los demás resultados.",
        }],
        note: "Ejercicio ilustrativo, no una prueba neuropsicológica validada.",
      });
    }
    tips = [asrs >= 4 || wurs >= 46 ? "El patrón combinado (actual + retrospectivo) sugiere valorar una evaluación diagnóstica completa de TDAH." : "No se identifica un patrón claro de TDAH en este tamizaje."];
  } else if (packId === "atencion") {
    const asrs = s.asrs!;
    instruments.push(single("ASRS v1.1 — Tamizaje de atención en adultos", asrs, 6, bandASRS(asrs), RISKY.asrs(asrs), tipASRS(asrs)));
    tips = [asrs >= 4
      ? "Los síntomas actuales justifican una evaluación más completa de TDAH en adultos, que incluya la historia desde la infancia y el impacto funcional."
      : "No se alcanza el umbral de este tamizaje; si las dificultades de atención afectan el día a día, conviene explorarlas en consulta."];
  } else if (packId === "personalidad") {
    const d = s.ipip50!;
    instruments.push({
      title: "IPIP-50 — Los cinco grandes",
      lines: IPIP_DOMAINS.map((label, i) => ({ label, score: `${d[i]} / 50`, pct: pct(d[i], 50), risky: false, band: bandIpip(d[i]), tip: ipipDetail(i, d[i]) })),
    });
    tips = ["Perfil de personalidad orientativo para autoconocimiento: ningún rasgo es positivo o negativo en sí mismo; su valor depende del contexto y de los objetivos personales."];
  } else if (packId === "emocional") {
    const t = s.tmms24!;
    instruments.push(tmmsBlock(t));
    tips = TMMS_DIMS.map(([k]) => tipTMMS(k, t[k]));
  }

  return {
    clientName: input.clientName,
    packId,
    packName: pack.name,
    referredBy: input.referredBy,
    instruments,
    summary: tips.join(" "),
    exercises: pickExercises(packId, s),
    recommendations: tips.map((t) => `- ${t}`).join("\n"),
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
    <div style="display:inline-block;width:46px;height:46px;line-height:46px;border-radius:50%;border:1px solid ${C.olive};font-family:${serif};font-style:italic;font-weight:600;color:${C.olive};font-size:17px">LR</div>
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
