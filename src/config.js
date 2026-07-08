// src/config.js

const DEFAULT_API_BASE_URL = "https://juego-trivia-backend.onrender.com";
const DEFAULT_WS_BASE_URL = "wss://juego-trivia-backend.onrender.com/ws";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  DEFAULT_API_BASE_URL;

const WS_BASE_URL =
  process.env.REACT_APP_WS_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  DEFAULT_WS_BASE_URL;

const buildSocketUrl = (baseUrl) => {
  if (!baseUrl) return DEFAULT_WS_BASE_URL;
  if (baseUrl.startsWith("ws://") || baseUrl.startsWith("wss://")) {
    return baseUrl.endsWith("/ws") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/ws`;
  }
  if (baseUrl.startsWith("http://")) {
    return baseUrl.replace("http://", "ws://").replace(/\/$/, "") + "/ws";
  }
  if (baseUrl.startsWith("https://")) {
    return baseUrl.replace("https://", "wss://").replace(/\/$/, "") + "/ws";
  }
  if (baseUrl.endsWith("/ws")) return baseUrl;
  if (baseUrl.endsWith("/")) return `${baseUrl}ws`;
  return `${baseUrl}/ws`;
};

const buildApiUrl = (baseUrl) => {
  if (!baseUrl) return DEFAULT_API_BASE_URL;
  if (baseUrl.endsWith("/")) return baseUrl.slice(0, -1);
  return baseUrl;
};

export { API_BASE_URL, WS_BASE_URL, buildSocketUrl, buildApiUrl };