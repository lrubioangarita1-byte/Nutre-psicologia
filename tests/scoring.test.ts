import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ASRS, EAT26, SCOFF,
  computeScores, elevatedFlags, riskLevel, sanitizeCpt, scoreInstrument,
} from "../src/lib/instruments";
import { PACKS, packInstrumentIds, preliminarySummary } from "../src/lib/packs";
import { buildReportDraft, renderReportHtml } from "../src/lib/report";

const fill = (n: number, v: number) => new Array(n).fill(v);
const idx = (inst: { scale: { l: string }[] }, label: string) => inst.scale.findIndex((o) => o.l === label);

test("GAD-7 suma 0-21", () => {
  assert.equal(scoreInstrument("gad7", fill(7, 0)), 0);
  assert.equal(scoreInstrument("gad7", fill(7, 3)), 21);
});

test("PSS-10 invierte ítems 4,5,7,8", () => {
  // Todo "Nunca" (0): ítems directos 0, invertidos 4 c/u → 16
  assert.equal(scoreInstrument("pss10", fill(10, 0)), 16);
  assert.equal(scoreInstrument("pss10", fill(10, 4)), 24);
});

test("TMMS-24 subescalas de 8 ítems", () => {
  const ans = [...fill(8, 0), ...fill(8, 2), ...fill(8, 4)]; // índices → valores 1,3,5
  assert.deepEqual(scoreInstrument("tmms24", ans), { atencion: 8, claridad: 24, reparacion: 40 });
});

test("EAT-26: 'Siempre' puntúa 3, 'Nunca' 0, y el ítem 25 va invertido", () => {
  const siempre = idx(EAT26, "Siempre");
  const nunca = idx(EAT26, "Nunca");
  assert.equal(scoreInstrument("eat26", fill(26, nunca)), 3); // solo el ítem 25 invertido suma 3
  assert.equal(scoreInstrument("eat26", fill(26, siempre)), 75); // 25 ítems × 3, ítem 25 = 0
  const amenudo = idx(EAT26, "A menudo");
  assert.equal(scoreInstrument("eat26", fill(26, amenudo)), 25);
});

test("SCOFF cuenta los Sí", () => {
  const si = idx(SCOFF, "Sí"), no = idx(SCOFF, "No");
  assert.equal(scoreInstrument("scoff", [si, si, no, no, no]), 2);
});

test("IPIP-50: respuestas neutras dan 30 por dominio; estabilidad invierte los 8 ítems de malestar", () => {
  assert.deepEqual(scoreInstrument("ipip50", fill(50, 2)), [30, 30, 30, 30, 30]);
  // "Muy de acuerdo" en todo: Estabilidad = 2 ítems positivos ×5 + 8 invertidos ×1 = 18
  const d = scoreInstrument("ipip50", fill(50, 4)) as number[];
  assert.equal(d[3], 18);
  assert.equal(d[0], 30); // 5 directos ×5 + 5 invertidos ×1
});

test("Rosenberg 10-40 con ítems 6-10 invertidos", () => {
  assert.equal(scoreInstrument("rosenberg", [...fill(5, 3), ...fill(5, 0)]), 40);
  assert.equal(scoreInstrument("rosenberg", [...fill(5, 0), ...fill(5, 3)]), 10);
});

test("ASRS usa los umbrales oficiales por ítem", () => {
  const aveces = idx(ASRS, "A veces");
  assert.equal(scoreInstrument("asrs", fill(6, aveces)), 3); // solo ítems 1-3 cuentan con "A veces"
  assert.equal(scoreInstrument("asrs", fill(6, idx(ASRS, "Frecuentemente"))), 6);
});

test("WURS-25 suma 0-100", () => {
  assert.equal(scoreInstrument("wurs25", fill(25, 4)), 100);
});

test("respuestas incompletas o inválidas lanzan error", () => {
  assert.throws(() => scoreInstrument("gad7", [0, 0, 0]));
  assert.throws(() => scoreInstrument("gad7", [...fill(6, 0), null]));
  assert.throws(() => scoreInstrument("gad7", [...fill(6, 0), 9]));
});

test("sanitizeCpt acota valores manipulados", () => {
  const r = sanitizeCpt({ hits: 999, misses: -3, falseAlarms: 2, avgRt: 99999 });
  assert.equal(r.hits, 8);
  assert.equal(r.accuracy, 100);
  assert.equal(r.misses, 0);
  assert.equal(r.avgRt, 850);
});

test("riesgo: crisis > elevado > normal", () => {
  assert.equal(riskLevel({ gad7: 3 }, true), "crisis");
  assert.equal(riskLevel({ gad7: 15 }, false), "elevado");
  assert.equal(riskLevel({ gad7: 14, pss10: 26 }, false), "normal");
  assert.deepEqual(elevatedFlags({ eat26: 19, scoff: 2 }).length, 1);
});

test("cada pack disponible calcula puntajes, lectura preliminar y borrador", () => {
  for (const pack of Object.values(PACKS).filter((p) => p.status === "disponible")) {
    const responses: Record<string, unknown> = {};
    for (const inst of pack.instruments) {
      responses[inst.id] = inst.kind === "game" ? { hits: 6, misses: 2, falseAlarms: 1, avgRt: 420 } : fill(inst.items.length, 1);
    }
    const scores = computeScores(packInstrumentIds(pack), responses);
    assert.ok(preliminarySummary(pack.id, scores).length > 20, pack.id);
    const draft = buildReportDraft({ packId: pack.id, clientName: "Ana <b>Pérez</b>", referredBy: null, scores });
    assert.equal(draft.exercises.length, 3, `${pack.id}: 3 ejercicios`);
    assert.equal(new Set(draft.exercises.map((e) => e.title)).size, 3, `${pack.id}: ejercicios sin repetir`);
    const html = renderReportHtml(draft, new Date());
    assert.ok(!html.includes("<b>Pérez</b>"), "el HTML escapa el texto");
    assert.ok(html.includes("Tarjeta Profesional 196983"));
  }
});
