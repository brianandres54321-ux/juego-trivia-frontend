// src/config.js

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://juego-trivia-backend.onrender.com";

const WS_BASE_URL =
  process.env.REACT_APP_WS_URL ||
  "wss://juego-trivia-backend.onrender.com/ws";

export { API_BASE_URL, WS_BASE_URL };