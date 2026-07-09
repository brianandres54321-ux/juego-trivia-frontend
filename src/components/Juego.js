// src/components/Juego.js
import React, { useState, useEffect } from "react";
import { enviarRespuesta } from "../services/socketService";
import MathViewer from "./MathViewer";

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

  if (!pregunta)
    return <h3 className="text-center mt-5">Cargando pregunta...</h3>;

  return (
    <div className="container mt-5">
      <div className="mb-4 text-center">
        <MathViewer text={pregunta.texto} />
      </div>

      <div className="row">
        {pregunta.respuestas.map((r, i) => (
          <div className="col-md-6 mb-3" key={r.id}>
            <button
              className={`btn btn-${
                ["primary", "success", "warning", "danger"][i]
              } w-100 text-start`}
              onClick={() => handleRespuesta(r)}
              disabled={respuestaSeleccionada !== null}
            >
              <MathViewer text={r.texto} />
            </button>
          </div>
        ))}
      </div>

      <p className="text-center mt-3 fw-bold">
        ⏳ Tiempo restante: {tiempoRestante}s
      </p>
    </div>
  );
}

export default Juego;
