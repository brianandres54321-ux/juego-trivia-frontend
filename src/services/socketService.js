import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../config";

let stompClient = null;

/**
 * 🔹 Conecta el cliente STOMP al servidor WebSocket
 */
export const conectarSocket = (callbacks) => {
  const { codigoSala, onConnect } = callbacks;
  // const socket = new SockJS("http://192.168.1.6/ws");
  const socket = new SockJS(`${API_BASE_URL}/ws`);



  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),

    onConnect: () => {
      console.log("✅ Conectado al servidor WebSocket");

      // 👉 Ejecutar callback para registrar al jugador actual
      if (onConnect) onConnect();

      // 🟢 Suscripción a eventos por sala
      stompClient.subscribe(
        `/topic/jugadoresActualizados/${codigoSala}`,
        (mensaje) => {
          const jugadores = JSON.parse(mensaje.body);
          callbacks.onJugadores && callbacks.onJugadores(jugadores);
        }
      );

      stompClient.subscribe(`/topic/pregunta/${codigoSala}`, (mensaje) => {
        const pregunta = JSON.parse(mensaje.body);
        callbacks.onPregunta && callbacks.onPregunta(pregunta);
      });

      stompClient.subscribe(`/topic/resultado/${codigoSala}`, (mensaje) => {
        const resultado = JSON.parse(mensaje.body);
        callbacks.onResultado && callbacks.onResultado(resultado);
      });

      stompClient.subscribe(`/topic/finJuego/${codigoSala}`, (mensaje) => {
        const ranking = JSON.parse(mensaje.body);
        callbacks.onFinJuego && callbacks.onFinJuego(ranking);
      });
    },
  });

  stompClient.activate();
};

/**
 * 🔹 Registrar nuevo jugador (con código de sala)
 */
export const enviarNuevoJugador = (nombre, codigoSala) => {
  if (stompClient && stompClient.connected) {
    console.log("📤 Enviando nuevo jugador:", nombre);
    stompClient.publish({
      destination: "/app/nuevoJugador",
      body: JSON.stringify({ nombre, codigo: codigoSala }),
    });
  } else {
    console.warn("⚠️ STOMP no conectado, no se puede enviar jugador");
  }
};

/**
 * 🔹 Iniciar el juego
 */
export const iniciarJuego = (codigoSala) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/iniciarJuego",
      body: JSON.stringify({ codigo: codigoSala }),
    });
  } else {
    console.warn("⚠️ STOMP no conectado, no se puede iniciar juego");
  }
};

/**
 * 🔹 Enviar respuesta del jugador
 */
export const enviarRespuesta = (jugador, idRespuesta, tiempo, codigoSala) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/responder",
      body: JSON.stringify({
        jugador,
        idRespuesta,
        tiempo,
        codigoSala,
      }),
    });
  } else {
    console.warn("⚠️ STOMP no conectado, no se puede enviar respuesta");
  }
};
