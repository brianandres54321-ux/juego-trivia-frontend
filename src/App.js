import React, { useState, useEffect } from "react";
import PantallaInicio from "./components/PantallaInicio";
import CrearPartidaPrivada from "./components/CrearPartidaPrivada";
import SalaEspera from "./components/SalaEspera";
import Juego from "./components/Juego";
import RankingFinal from "./components/RankingFinal";
import { conectarSocket, enviarNuevoJugador } from "./services/socketService";

function App() {
  const [jugador, setJugador] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [pregunta, setPregunta] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [fase, setFase] = useState("inicio");
  const [finalNombre, setFinalNombre] = useState(null);

  useEffect(() => {
    if (jugador && jugador.codigo) {
      conectarSocket({
        codigoSala: jugador.codigo,
        onConnect: () => {
          enviarNuevoJugador(jugador.nombre, jugador.codigo);
        },
        onJugadores: (lista) => setJugadores(lista),
        onPregunta: (pregunta) => {
          console.log("📩 Pregunta recibida:", pregunta);
          setPregunta(pregunta);
          setFase("juego");
        },
        onResultado: () => {},
        onFinJuego: (ranking) => {
          console.log("🏁 Fin del juego:", ranking);
          // Guardar ranking y nombre final para mostrar en la pantalla de fin,
          // y limpiar el estado `jugador` para que no quede nadie marcado como anfitrión.
          setRanking(ranking);
          setFinalNombre((prev) => (jugador && jugador.nombre ? jugador.nombre : prev));
          setFase("fin");
          setJugador(null);
        },
      });
    }
  }, [jugador]);

  // Fase inicial
  if (fase === "inicio") {
    return (
      <PantallaInicio
        onJoin={(datos) => {
          setJugador({ ...datos, privada: false });
          setFase("espera");
        }}
        onCrearPartidaPrivada={() => setFase("crear")}
      />
    );
  }

  // Crear partida privada
  if (fase === "crear") {
    return (
      <CrearPartidaPrivada
        onVolver={() => setFase("inicio")}
        onIrSalaEspera={(nombreJugador, codigo) => {
          setJugador({ nombre: nombreJugador, codigo });
          setFase("espera");
        }}
      />
    );
  }

  // Sala de espera
  if (fase === "espera") {
    return (
      <SalaEspera
        nombreJugador={jugador.nombre}
        jugadores={jugadores}
        codigoSala={jugador.codigo}
      />
    );
  }

  // Juego
  if (fase === "juego") {
    return (
      <Juego
        nombreJugador={jugador.nombre}
        jugadores={jugadores}
        pregunta={pregunta}
        codigoSala={jugador.codigo}
      />
    );
  }

  // Fin del juego
  if (fase === "fin") {
    return <RankingFinal ranking={ranking} nombreJugador={finalNombre} />;
  }

  return null;
}

export default App;
