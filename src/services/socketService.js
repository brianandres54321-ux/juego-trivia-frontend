import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_BASE_URL, API_BASE_URL, buildSocketUrl } from "../config";

let stompClient = null;

/**
 * 🔹 Conecta el cliente STOMP al servidor WebSocket
 */
export const conectarSocket = (callbacks) => {
  const { codigoSala, onConnect } = callbacks;
  const socketUrl = buildSocketUrl(WS_BASE_URL || API_BASE_URL);
  console.log("🔌 Conectando WebSocket a:", socketUrl);
  const socket = new SockJS(socketUrl);



  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),

    onConnect: () => {
      console.log("✅ Conectado al servidor WebSocket");

      // 👉 Ejecutar callback para registrar al jugador actual
      if (onConnect) onConnect();

      const suscribir = (destino, manejador) => {
        stompClient.subscribe(destino, (mensaje) => {
          try {
            const payload = JSON.parse(mensaje.body);
            manejador(payload);
          } catch (error) {
            console.warn("⚠️ Error leyendo mensaje STOMP", error, mensaje.body);
          }
        });
      };

      // 🟢 Suscripción a eventos por sala
      suscribir(`/topic/jugadoresActualizados/${codigoSala}`, (jugadores) => {
        callbacks.onJugadores && callbacks.onJugadores(jugadores);
      });
      suscribir(`/topic/jugadoresActualizados`, (jugadores) => {
        callbacks.onJugadores && callbacks.onJugadores(jugadores);
      });

      suscribir(`/topic/pregunta/${codigoSala}`, (pregunta) => {
        callbacks.onPregunta && callbacks.onPregunta(pregunta);
      });
      suscribir(`/topic/pregunta`, (pregunta) => {
        callbacks.onPregunta && callbacks.onPregunta(pregunta);
      });

      suscribir(`/topic/resultado/${codigoSala}`, (resultado) => {
        callbacks.onResultado && callbacks.onResultado(resultado);
      });
      suscribir(`/topic/resultado`, (resultado) => {
        callbacks.onResultado && callbacks.onResultado(resultado);
      });

      suscribir(`/topic/finJuego/${codigoSala}`, (ranking) => {
        callbacks.onFinJuego && callbacks.onFinJuego(ranking);
      });
      suscribir(`/topic/finJuego`, (ranking) => {
        callbacks.onFinJuego && callbacks.onFinJuego(ranking);
      });
    },

    onStompError: (frame) => {
      console.error("❌ Error STOMP:", frame);
    },

    onWebSocketError: (event) => {
      console.error("❌ Error de WebSocket:", event);
    },

    onWebSocketClose: () => {
      console.warn("⚠️ WebSocket cerrado");
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
