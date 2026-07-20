// src/components/ResultadoPregunta.js
import React from "react";
import MathViewer from "./MathViewer";

function medalClass(posicion) {
  if (posicion === 0) return "tv-medal tv-medal-1";
  if (posicion === 1) return "tv-medal tv-medal-2";
  if (posicion === 2) return "tv-medal tv-medal-3";
  return "tv-medal tv-medal-n";
}

function medalLabel(posicion) {
  if (posicion === 0) return "🥇";
  if (posicion === 1) return "🥈";
  if (posicion === 2) return "🥉";
  return posicion + 1;
}

function ResultadoPregunta({ resultado, nombreJugador }) {
  if (!resultado) {
    return (
      <div className="tv-shell">
        <p className="tv-subtitle tv-pulse fs-4">Cargando resultado...</p>
      </div>
    );
  }

  return (
    <div className="tv-shell">
      <div className="tv-card tv-card-wide text-center">
        <span className="tv-eyebrow">📊 Resultado</span>

        <div className="mb-4 fs-4 fw-semibold">
          <MathViewer text={resultado.preguntaTexto} />
        </div>

        <div className="tv-banner-success mb-4">
          ✅ Respuesta correcta:{" "}
          <strong>
            <MathViewer text={resultado.respuestaCorrectaTexto} />
          </strong>
        </div>

        {resultado.ranking && resultado.ranking.length > 0 && (
          <div className="tv-panel text-start">
            <h6 className="tv-label mb-3">Puntuación actual</h6>
            <div className="tv-scroll-list">
              {resultado.ranking.map((j, i) => (
                <div
                  key={i}
                  className={`tv-player-row ${j.nombre === nombreJugador ? "tv-is-me" : ""}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className={medalClass(i)}>{medalLabel(i)}</div>
                    <span className="fw-semibold">{j.nombre}</span>
                  </div>
                  <span className="tv-points">{j.puntos} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="tv-text-muted tv-pulse mt-4 mb-0">
          ⏳ La siguiente pregunta comenzará en breve...
        </p>
      </div>
    </div>
  );
}

export default ResultadoPregunta;
