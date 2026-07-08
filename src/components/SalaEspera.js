import React from "react";
import { iniciarJuego } from "../services/socketService";

function SalaEspera({ nombreJugador, jugadores = [], codigoSala }) {
  const esAnfitrion = jugadores.length > 0 && jugadores[0].nombre === nombreJugador;

  const handleIniciarJuego = () => {
    if (!codigoSala) return alert("⚠️ No se ha definido un código de sala.");
    if (jugadores.length === 0)
      return alert("⚠️ Se necesita al menos un jugador.");
    iniciarJuego(codigoSala);
  };

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">🎯 Sala de Espera</h2>
        <p className="fs-5 text-muted">
          Bienvenido,{" "}
          <strong className="text-success">{nombreJugador || "Jugador"}</strong>
        </p>
        <p className="text-secondary small">
          <strong>Código de sala:</strong> {codigoSala}
        </p>
      </div>

      <div className="card shadow-lg border-0 w-75">
        <div className="card-header bg-primary text-white text-center">
          <h4 className="m-0">Jugadores Conectados ({jugadores.length})</h4>
        </div>

        <div
          className="card-body"
          style={{ maxHeight: "300px", overflowY: "auto", background: "#f9fafc" }}
        >
          {jugadores.length === 0 ? (
            <div className="text-center text-secondary py-3">
              <em>No hay jugadores conectados todavía...</em>
            </div>
          ) : (
            <div className="row">
              {jugadores.map((j, index) => (
                <div key={index} className="col-md-6 col-lg-4 mb-3">
                  <div
                    className={`card h-100 shadow-sm border-0 ${
                      j.nombre === nombreJugador ? "border-success" : ""
                    }`}
                  >
                    <div
                      className={`card-body text-center rounded-3 ${
                        j.nombre === nombreJugador
                          ? "bg-success bg-opacity-25"
                          : "bg-light"
                      }`}
                    >
                      <h5 className="card-title mb-2 text-dark">
                        {index + 1}. {j.nombre}
                      </h5>
                      <p className="card-text text-secondary">
                        🏆 {j.puntos ?? 0} puntos
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-footer bg-white text-center">
          {esAnfitrion ? (
            <button
              className={`btn btn-lg ${
                jugadores.length === 0
                  ? "btn-secondary disabled"
                  : "btn-success shadow"
              }`}
              onClick={handleIniciarJuego}
            >
              {jugadores.length === 0
                ? "Esperando jugadores..."
                : "🚀 Iniciar Juego"}
            </button>
          ) : (
            <p className="text-muted mt-2">
              Esperando a que el anfitrión inicie el juego...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalaEspera;
