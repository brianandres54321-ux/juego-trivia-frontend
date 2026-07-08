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
    <div className="container text-center mt-5 p-4 card shadow border-0">
      <h1 className="mb-4 text-primary fw-bold">🎯 Bienvenido a Trivia</h1>

      {/* Nombre */}
      <input
        type="text"
        className="form-control w-75 mx-auto mb-3"
        placeholder="Tu nombre..."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* Selector de categoría SOLO si no es privada */}
      {!privada && (
        <select
          className="form-select w-75 mx-auto mb-3"
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
      )}

      <div className="d-flex justify-content-center gap-3 mb-3">
        <div className="form-check form-switch d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="privadaCheck"
            checked={privada}
            onChange={() => {
              setPrivada(!privada);
              if (!privada) setCategoriaSeleccionada("");
            }}
          />
          <label className="form-check-label ms-2" htmlFor="privadaCheck">
            Unirme a una sala privada
          </label>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={onCrearPartidaPrivada}
          type="button"
        >
          🔒 Crear partida personalizada
        </button>
      </div>

      {/* Código de sala privada */}
      {privada && (
        <input
          type="text"
          className="form-control w-75 mx-auto mb-3"
          placeholder="Código de sala privada"
          value={codigoSala}
          onChange={(e) => setCodigoSala(e.target.value)}
        />
      )}

      <button
        className="btn btn-success btn-lg shadow"
        onClick={manejarInicio}
      >
        🚀 Entrar al juego
      </button>

      {/* Contenedor de notificaciones */}
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}

export default PantallaInicio;
