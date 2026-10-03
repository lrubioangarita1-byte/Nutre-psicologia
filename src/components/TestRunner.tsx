"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CPT_LETTERS,
  CPT_TRIAL_MS,
  SAFETY_QUESTION,
  type CptResult,
  type Instrument,
  type QuestionInstrument,
  type Responses,
  type Scores,
} from "@/lib/instruments";
import { PACKS, type PackId } from "@/lib/packs";
import { CrisisBox, Results } from "./Results";
import { InstrumentIconSvg } from "./InstrumentIcon";

type Props = {
  token: string;
  packId: PackId;
  clientName: string;
  initialResponses: Responses;
  initialSafety: boolean | null;
};

type Step = { kind: "inst"; idx: number } | { kind: "safety" };

function isComplete(inst: Instrument, r: Responses) {
  if (inst.kind === "game") return Boolean(r.cpt);
  const arr = r[inst.id];
  return Boolean(arr && arr.length === inst.items.length && arr.every((v) => v !== null && v !== undefined));
}

export function TestRunner({ token, packId, clientName, initialResponses, initialSafety }: Props) {
  const pack = PACKS[packId];
  const steps: Step[] = useMemo(
    () => [...pack.instruments.map((_, idx) => ({ kind: "inst" as const, idx })), ...(pack.clinical ? [{ kind: "safety" as const }] : [])],
    [pack],
  );

  const firstIncomplete = pack.instruments.findIndex((i) => !isComplete(i, initialResponses));
  const [stepIdx, setStepIdx] = useState(firstIncomplete === -1 ? Math.max(0, steps.length - 1) : firstIncomplete);
  const [phase, setPhase] = useState<"intro" | "q" | "game">("intro");
  const [qIndex, setQIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>(initialResponses);
  const [safety, setSafety] = useState<boolean | null>(initialSafety);
  const [safetySaved, setSafetySaved] = useState(initialSafety !== null);
  const [result, setResult] = useState<{ scores: Scores; crisis: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const step = steps[stepIdx];
  const inst = step?.kind === "inst" ? pack.instruments[step.idx] : null;

  /* ---------- Guardado automático del avance ---------- */
  const dirty = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(responses);
  latest.current = responses;

  const flush = useCallback(() => {
    if (!dirty.current) return;
    dirty.current = false;
    fetch(`/api/evaluacion/${token}/progreso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respuestas: latest.current }),
      keepalive: true,
    }).catch(() => {
      dirty.current = true;
    });
  }, [token]);

  useEffect(() => {
    if (!dirty.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 1200);
  }, [responses, flush]);

  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [flush]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stepIdx, phase, qIndex]);

  /* ---------- Navegación ---------- */
  function goNextStep() {
    flush();
    setPhase("intro");
    setQIndex(0);
    if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
    else finish();
  }

  function goBackStep() {
    if (stepIdx === 0) return;
    const prev = steps[stepIdx - 1];
    setStepIdx(stepIdx - 1);
    if (prev.kind === "inst") {
      const p = pack.instruments[prev.idx];
      if (p.kind === "questions") {
        setPhase("q");
        setQIndex(p.items.length - 1);
        return;
      }
    }
    setPhase("intro");
  }

  function answer(q: QuestionInstrument, i: number, optIdx: number) {
    const arr = [...(responses[q.id] ?? new Array(q.items.length).fill(null))];
    arr[i] = optIdx;
    dirty.current = true;
    setResponses({ ...responses, [q.id]: arr });
    setTimeout(() => {
      if (i < q.items.length - 1) setQIndex(i + 1);
      else goNextStep();
    }, 180);
  }

  function onCptDone(r: CptResult) {
    dirty.current = true;
    setResponses((prev) => ({ ...prev, cpt: r }));
    latest.current = { ...latest.current, cpt: r };
    goNextStep();
  }

  async function answerSafety(yes: boolean) {
    // La respuesta (y el mensaje de crisis si es "Sí") se mantiene en pantalla aunque falle la red;
    // el guardado se reintenta varias veces porque de él depende la alerta urgente a la psicóloga.
    setSafety(yes);
    setSafetySaved(false);
    setError("");
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await fetch(`/api/evaluacion/${token}/seguridad`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ respuesta: yes }),
        });
        if (res.ok) {
          setSafetySaved(true);
          return;
        }
      } catch {
        // reintentar
      }
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
    setError("No pudimos guardar tu respuesta por un problema de conexión. Vuelve a marcarla para intentarlo de nuevo.");
  }

  async function finish() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/evaluacion/${token}/finalizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas: latest.current }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No pudimos guardar tus resultados.");
      setResult({ scores: json.scores, crisis: Boolean(json.crisis) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar tus resultados.");
    } finally {
      setBusy(false);
    }
  }

  /* ---------- Progreso ---------- */
  const progressPct = result
    ? 100
    : Math.round(((stepIdx + (inst?.kind === "questions" && phase === "q" ? qIndex / inst.items.length : 0)) / steps.length) * 100);
  const label = result ? "Resultados" : `Parte ${stepIdx + 1} de ${steps.length}`;

  /* ---------- Render ---------- */
  let body: React.ReactNode;
  if (result) {
    body = <Results pack={pack} scores={result.scores} crisis={result.crisis} />;
  } else if (step.kind === "safety") {
    body = (
      <div>
        <div className="app-h">Una última pregunta</div>
        <div className="app-sub">Esta pregunta nos ayuda a cuidarte mejor.</div>
        <div className="q-single-text">{SAFETY_QUESTION}</div>
        <div className="q-options">
          <label className="q-option">
            <input type="radio" name="safety" checked={safety === true} onChange={() => answerSafety(true)} /> Sí
          </label>
          <label className="q-option">
            <input type="radio" name="safety" checked={safety === false} onChange={() => answerSafety(false)} /> No
          </label>
        </div>
        {safety === true && <div style={{ marginTop: 20 }}><CrisisBox /></div>}
        <div className="app-nav">
          <button className="btn btn-ghost" onClick={goBackStep} disabled={busy}>Atrás</button>
          <button className="btn btn-primary" onClick={finish} disabled={safety === null || !safetySaved || busy}>
            {busy ? "Guardando…" : "Ver mis resultados"}
          </button>
        </div>
      </div>
    );
  } else if (inst && phase === "intro") {
    const done = isComplete(inst, responses);
    body = (
      <div>
        {inst.icon && <div style={{ textAlign: "center", marginBottom: 14 }}><InstrumentIconSvg icon={inst.icon} /></div>}
        <div className="app-h" style={inst.icon ? { textAlign: "center" } : undefined}>{inst.name}</div>
        <div className="inst-intro">{inst.intro}</div>
        <div className="app-sub">
          {inst.kind === "game"
            ? "Toma menos de 1 minuto"
            : `${inst.items.length} preguntas · toma menos de ${Math.max(1, Math.round(inst.items.length / 4))} minutos`}
        </div>
        <div className="app-nav">
          {stepIdx > 0 ? <button className="btn btn-ghost" onClick={goBackStep}>Atrás</button> : <span />}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {done && <button className="btn btn-ghost" onClick={goNextStep} disabled={busy}>Ya la respondí, continuar</button>}
            <button className="btn btn-primary" onClick={() => setPhase(inst.kind === "game" ? "game" : "q")}>
              {done ? "Revisar respuestas" : "Comenzar esta parte"}
            </button>
          </div>
        </div>
      </div>
    );
  } else if (inst && inst.kind === "game") {
    body = <CptGame onDone={onCptDone} />;
  } else if (inst && inst.kind === "questions") {
    const answers = responses[inst.id] ?? [];
    body = (
      <div>
        <div className="q-dots" aria-hidden="true">
          {inst.items.map((_, di) => (
            <span key={di} className={`q-dot${di < qIndex ? " done" : di === qIndex ? " active" : ""}`} />
          ))}
        </div>
        {inst.items.length >= 15 && qIndex === Math.floor(inst.items.length / 2) && (
          <div className="milestone">Vas por la mitad — sigue así ✨</div>
        )}
        <div className="muted" style={{ marginBottom: 6 }}>Pregunta {qIndex + 1} de {inst.items.length}</div>
        <div className="q-single-text">{inst.items[qIndex]}</div>
        <div className="q-options" role="radiogroup">
          {inst.scale.map((opt, oi) => (
            <label className="q-option" key={`${qIndex}-${oi}`}>
              <input
                type="radio"
                name={`q-${inst.id}-${qIndex}`}
                checked={answers[qIndex] === oi}
                onChange={() => answer(inst, qIndex, oi)}
              />{" "}
              {opt.l}
            </label>
          ))}
        </div>
        <div className="app-nav">
          <button className="btn btn-ghost" onClick={() => (qIndex > 0 ? setQIndex(qIndex - 1) : setPhase("intro"))}>Atrás</button>
          {answers[qIndex] !== null && answers[qIndex] !== undefined && qIndex < inst.items.length - 1 && (
            <button className="btn btn-ghost" onClick={() => setQIndex(qIndex + 1)}>Siguiente</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="app-bar">
        <span className="brand-mini"><span className="mono">LR</span> Laura Rubio</span>
        <span className="step-label">{label}</span>
      </div>
      <div className="app-body">
        <div className="app-progress"><div className="app-progress-fill" style={{ width: `${progressPct}%` }} /></div>
        {stepIdx === 0 && phase === "intro" && !result && (
          <p className="muted" style={{ marginTop: -12, marginBottom: 20 }}>
            Hola {clientName.split(" ")[0]} — tu avance se guarda automáticamente. Si necesitas pausar, puedes volver con el enlace que te
            llegó al correo.
          </p>
        )}
        {error && <div className="error-msg" role="alert">{error}</div>}
        {body}
      </div>
    </div>
  );
}

/* ---------- Prueba breve de atención (CPT) ---------- */
function CptGame({ onDone }: { onDone: (r: CptResult) => void }) {
  const [i, setI] = useState(-1); // -1 = preparándose
  const state = useRef({ hits: 0, misses: 0, falseAlarms: 0, rts: [] as number[], tapped: false, start: 0 });
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const t = setTimeout(() => setI(0), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (i < 0) return;
    if (i >= CPT_LETTERS.length) {
      const s = state.current;
      const targets = CPT_LETTERS.filter((l) => l === "X").length;
      doneRef.current({
        hits: s.hits,
        misses: s.misses,
        falseAlarms: s.falseAlarms,
        accuracy: Math.round((s.hits / targets) * 100),
        avgRt: s.rts.length ? Math.round(s.rts.reduce((a, b) => a + b, 0) / s.rts.length) : null,
      });
      return;
    }
    state.current.tapped = false;
    state.current.start = performance.now();
    const t = setTimeout(() => {
      if (CPT_LETTERS[i] === "X" && !state.current.tapped) state.current.misses++;
      setI(i + 1);
    }, CPT_TRIAL_MS);
    return () => clearTimeout(t);
  }, [i]);

  function tap() {
    const s = state.current;
    if (i < 0 || i >= CPT_LETTERS.length || s.tapped) return;
    s.tapped = true;
    if (CPT_LETTERS[i] === "X") {
      s.hits++;
      s.rts.push(Math.round(performance.now() - s.start));
    } else {
      s.falseAlarms++;
    }
  }

  if (i < 0) return <div style={{ textAlign: "center", padding: "60px 0" }}><div className="app-h">Prepárate…</div></div>;
  if (i >= CPT_LETTERS.length) return <div style={{ textAlign: "center", padding: "60px 0" }}><div className="app-h">¡Listo!</div></div>;
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div className="cpt-letter" aria-live="assertive">{CPT_LETTERS[i]}</div>
      <button className="btn btn-primary" style={{ padding: "22px 44px", fontSize: 18, borderRadius: 50 }} onPointerDown={tap} onClick={(e) => { if (e.detail === 0) tap(); }}>
        ¡Toca si es X!
      </button>
      <div className="muted" style={{ marginTop: 18 }}>Ensayo {i + 1} de {CPT_LETTERS.length}</div>
    </div>
  );
}
