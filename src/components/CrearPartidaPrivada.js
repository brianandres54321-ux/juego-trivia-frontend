import React, { useState, useEffect } from "react";
import axios from "axios";
import PreguntaForm from "./PreguntaForm";
import MathViewer from "./MathViewer";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../config"; // 🔹 Importa la URL base global

function CrearPartidaPrivada({ onVolver, onIrSalaEspera }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [nombreCreador, setNombreCreador] = useState("");
  const [creando, setCreando] = useState(false);
  const [codigoSala, setCodigoSala] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/categorias`)
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  const agregarPregunta = (pregunta) => {
    setPreguntas((prev) => [...prev, pregunta]);
  };

  const crearPartida = async () => {
    try {
      if (!nombreCreador.trim()) return toast.warn("⚠️ Ingresa tu nombre");
      if (!categoriaSeleccionada && !nuevaCategoria)
        return toast.warn("⚠️ Selecciona o crea una categoría");
      if (preguntas.length === 0)
        return toast.warn("⚠️ Agrega al menos una pregunta");

      setCreando(true);

      let idCategoria = categoriaSeleccionada;

      // 🟢 Crear nueva categoría si no existe
      if (!idCategoria && nuevaCategoria.trim() !== "") {
        const nombreNormalizado = nuevaCategoria.trim().toLowerCase();
        const categoriaExistente = categorias.find(
          (cat) => cat.nombre.trim().toLowerCase() === nombreNormalizado
        );

        if (categoriaExistente) {
          toast.info(`ℹ️ La categoría "${categoriaExistente.nombre}" ya existe.`);
          idCategoria = categoriaExistente.idCategoria;
        } else {
          const resCat = await axios.post(`${API_BASE_URL}/api/categorias`, {
            nombre: nuevaCategoria.trim(),
          });
          idCategoria = resCat.data.idCategoria;
          setCategorias((prev) => [...prev, resCat.data]);
        }
      }

      // 🟠 Crear partida privada
      const resPartida = await axios.post(`${API_BASE_URL}/api/partidas/crearPrivada`, {
        categoria: { idCategoria },
        usuario: nombreCreador,
      });

      const partida = resPartida.data;

      // 🔹 Guardar preguntas y respuestas con referencia a la partida
      for (const p of preguntas) {
        const resPregunta = await axios.post(`${API_BASE_URL}/api/preguntas`, {
          texto: p.texto,
          categoria: { idCategoria },
          partida: { idPartida: partida.idPartida }, // 🔹 Asociar pregunta con partida
        });

        for (const r of p.respuestas) {
          await axios.post(`${API_BASE_URL}/api/respuestas`, {
            texto: r.texto,
            correcta: r.correcta,
            pregunta: { idPregunta: resPregunta.data.idPregunta },
          });
        }
      }

      // ✅ Guardar el código generado
      setCodigoSala(partida.codigo);
      toast.success("🎉 ¡Partida creada con éxito!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al crear la partida");
    } finally {
      setCreando(false);
    }
  };

  const copiarCodigo = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // ✅ Copiar usando la API moderna (solo HTTPS o localhost)
        await navigator.clipboard.writeText(codigoSala);
      } else {
        // ⚙️ Fallback para entornos no seguros (como IP local)
        const textArea = document.createElement("textarea");
        textArea.value = codigoSala;
        textArea.style.position = "fixed"; // evita scroll
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      toast.info("📋 Código copiado", { autoClose: 1500 });
    } catch (err) {
      console.error("❌ Error al copiar:", err);
      toast.error("No se pudo copiar el código 😕");
    }
  };

  if (codigoSala) {
    return (
      <div className="tv-shell">
        <div className="tv-card text-center">
          <span className="tv-eyebrow">🎮 Listo</span>
          <h3 className="tv-title mb-3">¡Partida creada!</h3>
          <p className="tv-subtitle mb-3">Comparte este código con tus amigos:</p>
          <div className="tv-code-chip mb-4">{codigoSala}</div>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="tv-btn tv-btn-ghost" onClick={copiarCodigo}>
              📋 Copiar código
            </button>
            <button
              className="tv-btn tv-btn-primary"
              onClick={() => onIrSalaEspera(nombreCreador, codigoSala)}
            >
              🚀 Ir a sala de espera
            </button>
          </div>
        </div>

        <ToastContainer position="top-center" theme="dark" />
      </div>
    );
  }

  return (
    <div className="tv-shell">
      <div className="tv-card tv-card-wide">
        <span className="tv-eyebrow">🔒 Personalizada</span>
        <h3 className="tv-title mb-4">Crear partida privada</h3>

        <div className="tv-field">
          <label className="tv-label">👤 Tu nombre (anfitrión)</label>
          <input
            type="text"
            className="tv-input"
            placeholder="Tu nombre..."
            value={nombreCreador}
            onChange={(e) => setNombreCreador(e.target.value)}
          />
        </div>

        <div className="tv-field">
          <label className="tv-label">📂 Categoría</label>
          <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
            <select
              className="tv-select"
              value={categoriaSeleccionada}
              onChange={(e) => {
                setCategoriaSeleccionada(e.target.value);
                setNuevaCategoria("");
              }}
            >
              <option value="">Seleccionar existente...</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="tv-input"
              placeholder="...o crear una nueva"
              value={nuevaCategoria}
              onChange={(e) => {
                setNuevaCategoria(e.target.value);
                setCategoriaSeleccionada("");
              }}
            />
          </div>
        </div>

        <PreguntaForm onAgregar={agregarPregunta} />

        {preguntas.length > 0 && (
          <div className="mt-4">
            <h6 className="tv-label mb-2">📚 Preguntas agregadas ({preguntas.length})</h6>
            <div className="tv-scroll-list">
              {preguntas.map((p, i) => (
                <div key={i} className="tv-player-row mb-2">
                  <MathViewer text={p.texto} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between mt-4 gap-3">
          <button className="tv-btn tv-btn-ghost" onClick={onVolver}>
            ⬅ Volver
          </button>
          <button className="tv-btn tv-btn-primary" onClick={crearPartida} disabled={creando}>
            {creando ? "Creando..." : "🚀 Crear partida"}
          </button>
        </div>

        <ToastContainer position="top-center" theme="dark" />
      </div>
    </div>
  );
}

export default CrearPartidaPrivada;
