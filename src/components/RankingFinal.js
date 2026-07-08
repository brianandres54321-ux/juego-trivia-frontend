// src/components/RankingFinal.js
import React from "react";
import { motion } from "framer-motion";

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
    <motion.div
      className="container text-center mt-5 p-4 card shadow-lg border-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-primary fw-bold mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🏁 Fin del juego
      </motion.h2>

      <motion.p
        className="text-muted mb-4 fs-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ¡Buen trabajo, <strong className="text-success">{nombreJugador}</strong>!
      </motion.p>

      <div className="table-responsive">
        <motion.table
          className="table table-striped table-hover w-75 mx-auto align-middle"
          variants={containerVariants}
        >
          <thead className="table-primary">
            <tr>
              <th style={{ width: "80px" }}>#</th>
              <th>Jugador</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <motion.tbody variants={containerVariants}>
            {ranking.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              ranking.map((j, i) => (
                <motion.tr
                  key={i}
                  variants={rowVariants}
                  className={
                    j.nombre === nombreJugador
                      ? "table-success fw-bold"
                      : i === 0
                      ? "table-warning"
                      : ""
                  }
                >
                  <td className="fs-5">
                    <motion.span
                      animate={{
                        scale: i < 3 ? [1, 1.3, 1] : 1,
                        color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#000",
                      }}
                      transition={{
                        repeat: i < 3 ? Infinity : 0,
                        repeatDelay: 2,
                        duration: 1.5,
                      }}
                    >
                      {getMedalla(i)}
                    </motion.span>
                  </td>
                  <td className="fs-5">{j.nombre}</td>
                  <td className="fs-5 fw-semibold">{j.puntos ?? 0}</td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </motion.table>
      </div>

      <motion.button
        className="btn btn-primary btn-lg mt-4 shadow"
        onClick={() => window.location.reload()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        🔄 Jugar de nuevo
      </motion.button>

      <footer className="mt-3 text-muted small">
        Desarrollado con ❤️ para tu juego de trivia
      </footer>
    </motion.div>
  );
}

export default RankingFinal;
