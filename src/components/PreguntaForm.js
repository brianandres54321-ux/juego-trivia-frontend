// src/components/PreguntaForm.js
import React, { useState } from "react";

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
        className="form-control mb-3"
        placeholder="Escribe la pregunta..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      {respuestas.map((r, i) => (
        <div key={i} className="input-group mb-2">
          <span className="input-group-text">{i + 1}</span>
          <input
            type="text"
            className="form-control"
            placeholder={`Respuesta ${i + 1}`}
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
      ))}

      <button className="btn btn-secondary w-100 mt-3" onClick={agregar}>
        ➕ Agregar pregunta
      </button>
    </div>
  );
}

export default PreguntaForm;
