// src/config.js

const DEFAULT_API_BASE_URL = "https://juego-trivia-backend.onrender.com";
const DEFAULT_WS_BASE_URL = "https://juego-trivia-backend.onrender.com/ws";

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

  const normalized = baseUrl.replace(/\/$/, "");

  if (normalized.startsWith("wss://")) {
    return normalized.replace("wss://", "https://");
  }
  if (normalized.startsWith("ws://")) {
    return normalized.replace("ws://", "http://");
  }
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized.endsWith("/ws") ? normalized : `${normalized}/ws`;
  }
  if (normalized.endsWith("/ws")) return normalized;
  return `${normalized}/ws`;
};

const buildApiUrl = (baseUrl) => {
  if (!baseUrl) return DEFAULT_API_BASE_URL;
  if (baseUrl.endsWith("/")) return baseUrl.slice(0, -1);
  return baseUrl;
};

export { API_BASE_URL, WS_BASE_URL, buildSocketUrl, buildApiUrl };