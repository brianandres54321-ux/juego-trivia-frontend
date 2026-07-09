// src/components/PreguntaForm.js
import React, { useState } from "react";
import MathViewer from "./MathViewer";

function PreguntaForm({ onAgregar }) {
  const [texto, setTexto] = useState("");
  const [respuestas, setRespuestas] = useState(["", "", "", ""]);
  const [correcta, setCorrecta] = useState(null);

  const agregar = () => {
    if (!texto.trim()) return alert("Escribe una pregunta");
    if (respuestas.some((r) => !r.trim())) return alert("Completa todas las respuestas");
    if (correcta === null) return alert("Selecciona la respuesta correcta");

    onAgregar({
      texto,
      respuestas: respuestas.map((r, i) => ({ texto: r, correcta: i === correcta })),
    });

    setTexto("");
    setRespuestas(["", "", "", ""]);
    setCorrecta(null);
  };

  return (
    <div className="mt-3 p-3 border rounded bg-light">
      <label className="fw-bold">📝 Nueva Pregunta</label>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Ej: Calcula el área si $x^2 + \sqrt{y}$..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      {texto && (
        <div className="p-2 mb-3 bg-white border rounded">
          <small className="text-muted d-block">Vista previa:</small>
          <MathViewer text={texto} />
        </div>
      )}

      {respuestas.map((r, i) => (
        <div key={i} className="mb-2">
          <div className="input-group">
            <span className="input-group-text">{i + 1}</span>
            <input
              type="text"
              className="form-control"
              placeholder={`Respuesta ${i + 1} (ej: $\\sqrt{16}$)`}
              value={r}
              onChange={(e) => {
                const copia = [...respuestas];
                copia[i] = e.target.value;
                setRespuestas(copia);
              }}
            />
            <button
              type="button"
              className={`btn ${correcta === i ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setCorrecta(i)}
            >
              ✓
            </button>
          </div>
          {r && (
            <div className="px-2 py-1 bg-white border-bottom border-start border-end rounded-bottom ms-4">
              <small className="text-muted me-2">Vista previa:</small>
              <MathViewer text={r} />
            </div>
          )}
        </div>
      ))}

      <button className="btn btn-secondary w-100 mt-3" onClick={agregar}>
        ➕ Agregar pregunta
      </button>
    </div>
  );
}

export default PreguntaForm;