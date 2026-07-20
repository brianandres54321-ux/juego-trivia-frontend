// src/components/RankingFinal.js
import React from "react";
import { motion } from "framer-motion";

function medalClass(posicion) {
  if (posicion === 0) return "tv-medal tv-medal-1";
  if (posicion === 1) return "tv-medal tv-medal-2";
  if (posicion === 2) return "tv-medal tv-medal-3";
  return "tv-medal tv-medal-n";
}

function RankingFinal({ ranking = [], nombreJugador }) {
  const getMedalla = (posicion) => {
    switch (posicion) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${posicion + 1}.`;
    }
  };

  // Animación general para la tabla
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Animación para cada fila
  const rowVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="tv-shell">
      <motion.div
        className="tv-card tv-card-wide text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="tv-eyebrow">🏁 Fin del juego</span>

        <motion.h2
          className="tv-title mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          ¡Partida terminada!
        </motion.h2>

        <motion.p
          className="tv-subtitle mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ¡Buen trabajo, <strong style={{ color: "var(--tv-cyan)" }}>{nombreJugador}</strong>!
        </motion.p>

        <div className="tv-panel text-start">
          {ranking.length === 0 ? (
            <p className="tv-text-muted text-center mb-0">No hay datos disponibles</p>
          ) : (
            <div>
              {ranking.map((j, i) => (
                <motion.div
                  key={i}
                  variants={rowVariants}
                  className={`tv-player-row ${j.nombre === nombreJugador ? "tv-is-me" : ""}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <motion.div
                      className={medalClass(i)}
                      animate={{
                        scale: i < 3 ? [1, 1.15, 1] : 1,
                      }}
                      transition={{
                        repeat: i < 3 ? Infinity : 0,
                        repeatDelay: 2,
                        duration: 1.5,
                      }}
                    >
                      {getMedalla(i)}
                    </motion.div>
                    <span className="fw-semibold">{j.nombre}</span>
                  </div>
                  <span className="tv-points">{j.puntos ?? 0} pts</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          className="tv-btn tv-btn-primary tv-btn-block mt-4"
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          🔄 Jugar de nuevo
        </motion.button>

        <footer className="tv-text-muted small mt-3">
          Desarrollado con ❤️ para tu juego de trivia
        </footer>
      </motion.div>
    </div>
  );
}

export default RankingFinal;
