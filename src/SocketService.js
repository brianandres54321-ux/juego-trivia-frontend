import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connect = (onPregunta, onResultado) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("✅ Conectado al servidor WebSocket");

      // Escucha las preguntas enviadas desde el backend
      stompClient.subscribe("/topic/pregunta", (message) => {
        const pregunta = JSON.parse(message.body);
        onPregunta(pregunta);
      });

      // Escucha los resultados
      stompClient.subscribe("/topic/resultado", (message) => {
        const resultado = JSON.parse(message.body);
        onResultado(resultado);
      });
    },
  });

  stompClient.activate();
};

// Enviar respuesta desde el cliente
export const enviarRespuesta = (respuesta) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/responder",
      body: JSON.stringify(respuesta),
    });
  }
};
