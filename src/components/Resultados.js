// src/services/socketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../config";

let stompClient = null;

/**
 * Conectar al servidor WebSocket
 * @param {Object} callbacks - Funciones de callback para cada evento
 */
export const conectarSocket = (callbacks) => {
  // const socket = new SockJS("http://localhost:8080/ws");
  const socket = new SockJS(`${API_BASE_URL}/ws`);
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
    
    onConnect: () => {
      console.log("✅ Conectado al servidor WebSocket");

      // Suscribirse a la lista de jugadores actualizados
      stompClient.subscribe("/topic/jugadoresActualizados", (mensaje) => {
        const jugadores = JSON.parse(mensaje.body);
        console.log("📋 Jugadores actualizados:", jugadores);
        if (callbacks.onJugadores) callbacks.onJugadores(jugadores);
      });

      // Suscribirse al evento de inicio de juego
      stompClient.subscribe("/topic/iniciarJuego", (mensaje) => {
        const data = JSON.parse(mensaje.body);
        console.log("🎮 Juego iniciado:", data);
        if (callbacks.onIniciarJuego) callbacks.onIniciarJuego(data);
      });

      // Suscribirse a las preguntas
      stompClient.subscribe("/topic/pregunta", (mensaje) => {
        const pregunta = JSON.parse(mensaje.body);
        console.log("❓ Nueva pregunta:", pregunta);
        if (callbacks.onPregunta) callbacks.onPregunta(pregunta);
      });

      // Suscribirse a los resultados de cada pregunta
      stompClient.subscribe("/topic/resultado", (mensaje) => {
        const resultado = JSON.parse(mensaje.body);
        console.log("📊 Resultado de pregunta:", resultado);
        if (callbacks.onResultado) callbacks.onResultado(resultado);
      });

      // Suscribirse al fin del juego
      stompClient.subscribe("/topic/finJuego", (mensaje) => {
        const ranking = JSON.parse(mensaje.body);
        console.log("🏆 Fin del juego - Ranking:", ranking);
        if (callbacks.onFinJuego) callbacks.onFinJuego(ranking);
      });
    },

    onDisconnect: () => {
      console.log("❌ Desconectado del servidor WebSocket");
    },

    onStompError: (frame) => {
      console.error("❌ Error STOMP:", frame);
    }
  });

  stompClient.activate();
};

/**
 * Enviar nuevo jugador al servidor
 * @param {string} nombre - Nombre del jugador
 */
export const enviarNuevoJugador = (nombre) => {
  if (stompClient && stompClient.connected) {
    console.log("📤 Enviando nuevo jugador:", nombre);
    stompClient.publish({
      destination: "/app/nuevoJugador",
      body: JSON.stringify({ nombre }),
    });
  } else {
    console.error("❌ Cliente no conectado");
  }
};

/**
 * Iniciar el juego (solo el host)
 */
export const iniciarJuego = () => {
  if (stompClient && stompClient.connected) {
    console.log("📤 Iniciando juego...");
    stompClient.publish({
      destination: "/app/iniciarJuego",
      body: JSON.stringify({}),
    });
  } else {
    console.error("❌ Cliente no conectado");
  }
};

/**
 * Enviar respuesta del jugador
 * @param {string} jugador - Nombre del jugador
 * @param {number} idRespuesta - ID de la respuesta seleccionada
 * @param {number} tiempo - Tiempo en milisegundos que tardó en responder
 */
export const enviarRespuesta = (jugador, idRespuesta, tiempo) => {
  if (stompClient && stompClient.connected) {
    console.log("📤 Enviando respuesta:", { jugador, idRespuesta, tiempo });
    stompClient.publish({
      destination: "/app/responder",
      body: JSON.stringify({ jugador, idRespuesta, tiempo }),
    });
  } else {
    console.error("❌ Cliente no conectado");
  }
};

/**
 * Desconectar del servidor WebSocket
 */
export const desconectar = () => {
  if (stompClient) {
    console.log("👋 Desconectando...");
    stompClient.deactivate();
  }
};