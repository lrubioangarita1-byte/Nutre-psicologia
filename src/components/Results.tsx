import { BRAND } from "@/lib/brand";
import { elevatedFlags, type Scores } from "@/lib/instruments";
import { clientResultBlocks, preliminarySummary, type Pack } from "@/lib/packs";

/** Convierte "**negrita**" y saltos dobles en párrafos. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((para, i) => (
        <p key={i}>
          {para.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") ? <b key={j}>{part.slice(2, -2)}</b> : <span key={j}>{part}</span>,
          )}
        </p>
      ))}
    </>
  );
}

export function CrisisBox() {
  return (
    <div className="crisis-box" role="alert">
      <h3>Gracias por confiar esta información</h3>
      <p>Lo que sientes es importante, y no tienes que pasar por esto solo/a.</p>
      <p>Si estás en peligro inmediato, comunícate ya con la Línea de Salud Mental:</p>
      <div className="line"><a href="tel:192">192, opción 4</a> — disponible las 24 horas</div>
      <p style={{ marginTop: 12 }}>
        Esta plataforma no está diseñada para atender crisis en tiempo real. Laura fue notificada y se pondrá en contacto contigo
        lo antes posible — pero por favor no esperes esa respuesta si necesitas ayuda ahora mismo. También puedes acudir al
        servicio de urgencias más cercano o llamar al 123.
      </p>
    </div>
  );
}

export function Results({ pack, scores, crisis }: { pack: Pack; scores: Scores; crisis: boolean }) {
  const elevated = elevatedFlags(scores).length > 0;
  const blocks = clientResultBlocks(pack, scores);
  return (
    <div>
      <div className="app-h">Tus resultados</div>
      <div className="app-sub">
        Estos puntajes son orientativos. Tus respuestas ya quedaron guardadas: tu informe personalizado, revisado por {BRAND.fullName},
        llega a tu correo en 12–24 horas.
      </div>

      {crisis ? (
        <CrisisBox />
      ) : elevated ? (
        <div className="crisis-box calm">
          <h3>Tus resultados sugieren buscar apoyo pronto</h3>
          <p>
            Esto no es una crisis, pero sí una señal importante. Te recomendamos buscar apoyo profesional pronto.
            {pack.edResource &&
              " Para temas de alimentación, también puedes contactar a National Alliance for Eating Disorders: +1 (866) 662-1235 (atención en español disponible)."}
          </p>
          <p>Tu informe personalizado llegará en las próximas horas con más detalle.</p>
        </div>
      ) : null}

      {!crisis && (
        <div className="summary-card">
          <RichText text={preliminarySummary(pack.id, scores)} />
        </div>
      )}

      {blocks.map((b) => (
        <div className="result-card" key={b.title}>
          <h4>{b.title}</h4>
          {b.lines.map((l, i) => (
            <div className="result-line" key={i}>
              <div className="result-score">{l.label ? `${l.label}: ` : ""}{l.score}</div>
              <div className="gauge"><div className={`gauge-fill${l.risky ? " risky" : ""}`} style={{ width: `${l.pct}%` }} /></div>
              <div className="result-band">{l.band}{l.detail ? ` — ${l.detail}` : ""}</div>
            </div>
          ))}
          {b.note && <div className="muted" style={{ marginTop: 8 }}>{b.note}</div>}
        </div>
      ))}

      <div className="safety-note">
        <span aria-hidden="true">✓</span>
        <div>
          <b>Listo.</b> No necesitas hacer nada más. Si en algún momento sientes que estás en crisis, comunícate con la {BRAND.crisisLine}.
        </div>
      </div>
    </div>
  );
}
