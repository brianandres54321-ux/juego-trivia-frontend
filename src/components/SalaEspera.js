import React from "react";
import { iniciarJuego } from "../services/socketService";

function iniciales(nombre = "") {
  return nombre.trim().slice(0, 1).toUpperCase() || "?";
}

function SalaEspera({ nombreJugador, jugadores = [], codigoSala }) {
  const esAnfitrion = jugadores.length > 0 && jugadores[0].nombre === nombreJugador;

  const handleIniciarJuego = () => {
    if (!codigoSala) return alert("⚠️ No se ha definido un código de sala.");
    if (jugadores.length === 0)
      return alert("⚠️ Se necesita al menos un jugador.");
    iniciarJuego(codigoSala);
  };

  return (
    <div className="tv-shell">
      <div className="tv-card tv-card-wide text-center">
        <span className="tv-eyebrow">⏳ Sala de espera</span>
        <h2 className="tv-title mb-1">¡Ya casi arrancamos!</h2>
        <p className="tv-subtitle mb-3">
          Bienvenido, <strong style={{ color: "var(--tv-cyan)" }}>{nombreJugador || "Jugador"}</strong>
        </p>
        <div className="mb-4">
          <span className="tv-badge">Código de sala: {codigoSala}</span>
        </div>

        <div className="tv-panel text-start">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0">Jugadores conectados</h5>
            <span className="tv-badge">{jugadores.length}</span>
          </div>

          {jugadores.length === 0 ? (
            <p className="tv-text-muted text-center py-3 mb-0 tv-pulse">
              Esperando a que se conecten jugadores...
            </p>
          ) : (
            <div className="tv-scroll-list">
              {jugadores.map((j, index) => (
                <div
                  key={index}
                  className={`tv-player-row ${j.nombre === nombreJugador ? "tv-is-me" : ""}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="tv-avatar">{iniciales(j.nombre)}</div>
                    <div>
                      <div className="fw-bold">
                        {j.nombre} {index === 0 && <span title="Anfitrión">👑</span>}
                      </div>
                      <div className="tv-text-muted small">Jugador #{index + 1}</div>
                    </div>
                  </div>
                  <span className="tv-points">{j.puntos ?? 0} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          {esAnfitrion ? (
            <button
              className={`tv-btn tv-btn-block ${jugadores.length === 0 ? "tv-btn-ghost" : "tv-btn-primary"}`}
              onClick={handleIniciarJuego}
              disabled={jugadores.length === 0}
            >
              {jugadores.length === 0 ? "Esperando jugadores..." : "🚀 Iniciar juego"}
            </button>
          ) : (
            <p className="tv-text-muted tv-pulse mb-0">
              Esperando a que el anfitrión inicie el juego...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalaEspera;
