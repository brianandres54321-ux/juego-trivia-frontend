import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../config";

function PantallaInicio({ onJoin, onCrearPartidaPrivada }) {
  const [nombre, setNombre] = useState("");
  const [codigoSala, setCodigoSala] = useState("");
  const [privada, setPrivada] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/categorias`)
      .then((res) => setCategorias(res.data))
      .catch(() => toast.error("❌ Error al cargar categorías"));
  }, []);

  const manejarInicio = () => {
    if (!nombre.trim()) {
      toast.warn("⚠️ Por favor ingresa tu nombre");
      return;
    }

    if (privada) {
      if (!codigoSala.trim()) {
        toast.info("🔒 Ingresa el código de la sala privada");
        return;
      }
    } else {
      if (!categoriaSeleccionada) {
        toast.warn("Selecciona una categoría antes de continuar");
        return;
      }
    }

    const codigoFinal = privada
      ? codigoSala.trim()
      : `PUBLICA-${categoriaSeleccionada}`;

    toast.success("✅ Conectando a la sala...");

    setTimeout(() => {
      onJoin({
        nombre: nombre.trim(),
        codigo: codigoFinal,
        categoria: privada ? null : categoriaSeleccionada,
      });
    }, 800); // pequeño delay para la animación del toast
  };

  return (
    <div className="tv-shell">
      <div className="tv-card text-center">
        <span className="tv-eyebrow">🧠 Trivia en vivo</span>
        <h1 className="tv-title display-5">Trivia Master</h1>
        <p className="tv-subtitle mb-4">
          Respondé rápido, sumá puntos y llevate la corona 👑
        </p>

        <div className="tv-field">
          <label className="tv-label">Tu nombre</label>
          <input
            type="text"
            className="tv-input"
            placeholder="¿Cómo te llamás?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {!privada && (
          <div className="tv-field">
            <label className="tv-label">Categoría</label>
            <select
              className="tv-select"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una categoría...</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {privada && (
          <div className="tv-field">
            <label className="tv-label">Código de sala privada</label>
            <input
              type="text"
              className="tv-input"
              placeholder="Ej: AMIGOS-42"
              value={codigoSala}
              onChange={(e) => setCodigoSala(e.target.value)}
            />
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-4">
          <label className="tv-toggle-row">
            <input
              className="tv-checkbox"
              type="checkbox"
              checked={privada}
              onChange={() => {
                setPrivada(!privada);
                if (!privada) setCategoriaSeleccionada("");
              }}
            />
            Unirme a una sala privada
          </label>

          <button
            className="tv-btn tv-btn-ghost tv-btn-sm"
            onClick={onCrearPartidaPrivada}
            type="button"
          >
            🔒 Crear partida personalizada
          </button>
        </div>

        <button
          className="tv-btn tv-btn-primary tv-btn-block"
          onClick={manejarInicio}
        >
          🚀 Entrar al juego
        </button>
      </div>

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
}

export default PantallaInicio;
