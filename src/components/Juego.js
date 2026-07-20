// src/components/Juego.js
import React, { useState, useEffect } from "react";
import { enviarRespuesta } from "../services/socketService";
import MathViewer from "./MathViewer";

const FORMAS = [
  { shape: "tv-shape-triangle", icon: "▲" },
  { shape: "tv-shape-diamond", icon: "◆" },
  { shape: "tv-shape-circle", icon: "●" },
  { shape: "tv-shape-square", icon: "■" },
];

const RADIO = 40;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

function TimerRing({ restante, total }) {
  const ratio = total > 0 ? Math.max(0, Math.min(1, restante / total)) : 0;
  const offset = CIRCUNFERENCIA * (1 - ratio);
  const color = ratio > 0.5 ? "var(--tv-emerald)" : ratio > 0.25 ? "var(--tv-amber)" : "var(--tv-red)";

  return (
    <div className="tv-timer">
      <svg viewBox="0 0 96 96">
        <circle className="tv-timer-track" cx="48" cy="48" r={RADIO} />
        <circle
          className="tv-timer-progress"
          cx="48"
          cy="48"
          r={RADIO}
          stroke={color}
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="tv-timer-value">{restante}</div>
    </div>
  );
}

function Juego({ nombreJugador, pregunta, jugadores, codigoSala }) {
  const [tiempoRestante, setTiempoRestante] = useState(15);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoInicio, setTiempoInicio] = useState(null);

  useEffect(() => {
    if (pregunta) {
      setTiempoRestante(pregunta.tiempoLimite || 15);
      setRespuestaSeleccionada(null);
      setTiempoInicio(Date.now());

      const interval = setInterval(() => {
        setTiempoRestante((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [pregunta]);

  const handleRespuesta = (respuesta) => {
    if (respuestaSeleccionada || tiempoRestante === 0) return;

    const tiempoRespuesta = Date.now() - tiempoInicio;
    setRespuestaSeleccionada(respuesta.id);

    // 🔹 Ahora enviamos también el código de la sala
    enviarRespuesta(nombreJugador, respuesta.id, tiempoRespuesta, codigoSala);
  };

  if (!pregunta) {
    return (
      <div className="tv-shell">
        <p className="tv-subtitle tv-pulse fs-4">Cargando pregunta...</p>
      </div>
    );
  }

  return (
    <div className="tv-shell">
      <div className="tv-card tv-card-wide">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="tv-badge">
            Pregunta {pregunta.numeroPregunta} / {pregunta.totalPreguntas}
          </span>
          <TimerRing restante={tiempoRestante} total={pregunta.tiempoLimite || 15} />
        </div>

        <div className="mb-4 text-center fs-4 fw-semibold">
          <MathViewer text={pregunta.texto} />
        </div>

        <div className="tv-answer-grid">
          {pregunta.respuestas.map((r, i) => {
            const forma = FORMAS[i % FORMAS.length];
            const esSeleccionada = respuestaSeleccionada === r.id;
            const dimmed = respuestaSeleccionada !== null && !esSeleccionada;

            return (
              <button
                key={r.id}
                className={`tv-answer-btn ${forma.shape} ${esSeleccionada ? "tv-is-selected" : ""} ${
                  dimmed ? "tv-is-dimmed" : ""
                }`}
                onClick={() => handleRespuesta(r)}
                disabled={respuestaSeleccionada !== null}
              >
                <span className="tv-shape">{forma.icon}</span>
                <MathViewer text={r.texto} />
              </button>
            );
          })}
        </div>

        {respuestaSeleccionada !== null && (
          <p className="text-center tv-subtitle mt-4 mb-0">
            ✅ Respuesta enviada. Esperando a los demás jugadores...
          </p>
        )}
      </div>
    </div>
  );
}

export default Juego;
