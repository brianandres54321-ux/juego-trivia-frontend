// src/components/PreguntaForm.js
import React, { useEffect, useRef, useState } from "react";
import MathViewer from "./MathViewer";

const COLORES = ["tv-shape-triangle", "tv-shape-diamond", "tv-shape-circle", "tv-shape-square"];

// Cada símbolo se inserta ya envuelto en "$...$" para que se renderice
// automáticamente, sin que el usuario tenga que conocer la sintaxis LaTeX.
// cursorGap = posición (dentro del snippet "$latex$") donde debe quedar el cursor.
const SIMBOLOS = [
  { label: "√", latex: "\\sqrt{}", cursorGap: 7, title: "Raíz cuadrada" },
  { label: "ⁿ√", latex: "\\sqrt[]{}", cursorGap: 7, title: "Raíz n-ésima" },
  { label: "xʸ", latex: "^{}", cursorGap: 3, title: "Exponente" },
  { label: "xᵧ", latex: "_{}", cursorGap: 3, title: "Subíndice" },
  { label: "a/b", latex: "\\frac{}{}", cursorGap: 7, title: "Fracción" },
  { label: "∑", latex: "\\sum_{}^{}", cursorGap: 7, title: "Sumatoria" },
  { label: "∫", latex: "\\int_{}^{}", cursorGap: 7, title: "Integral" },
  { label: "π", latex: "\\pi", title: "Pi" },
  { label: "±", latex: "\\pm", title: "Más/menos" },
  { label: "×", latex: "\\times", title: "Multiplicación" },
  { label: "÷", latex: "\\div", title: "División" },
  { label: "≤", latex: "\\le", title: "Menor o igual" },
  { label: "≥", latex: "\\ge", title: "Mayor o igual" },
  { label: "≠", latex: "\\ne", title: "Distinto" },
  { label: "∞", latex: "\\infty", title: "Infinito" },
  { label: "α", latex: "\\alpha", title: "Alfa" },
  { label: "θ", latex: "\\theta", title: "Theta" },
  { label: "Δ", latex: "\\Delta", title: "Delta" },
];

function PreguntaForm({ onAgregar }) {
  const [texto, setTexto] = useState("");
  const [respuestas, setRespuestas] = useState(["", "", "", ""]);
  const [correcta, setCorrecta] = useState(null);
  const [activeField, setActiveField] = useState({ type: "pregunta" });
  const [pendingCursor, setPendingCursor] = useState(null); // { esPregunta, index, pos }

  const preguntaRef = useRef(null);
  const respuestaRefs = useRef([null, null, null, null]);

  // Se ejecuta después de que React ya aplicó el nuevo valor al DOM,
  // así el cursor queda bien ubicado sin depender de un timeout "a ciegas".
  useEffect(() => {
    if (!pendingCursor) return;
    const node = pendingCursor.esPregunta
      ? preguntaRef.current
      : respuestaRefs.current[pendingCursor.index];
    if (node) {
      node.focus();
      node.setSelectionRange(pendingCursor.pos, pendingCursor.pos);
    }
    setPendingCursor(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, respuestas]);

  const insertSnippet = (item) => {
    const esPregunta = activeField.type === "pregunta";
    const node = esPregunta ? preguntaRef.current : respuestaRefs.current[activeField.index];
    const valorActual = esPregunta ? texto : respuestas[activeField.index];
    if (!node) return;

    const start = typeof node.selectionStart === "number" ? node.selectionStart : valorActual.length;
    const end = typeof node.selectionEnd === "number" ? node.selectionEnd : valorActual.length;
    const antes = valorActual.slice(0, start);
    const despues = valorActual.slice(end);

    let snippet = `$${item.latex}$`;
    let corrimiento = 0;
    // Evita que dos expresiones matemáticas queden pegadas y formen "$$"
    if (antes.endsWith("$")) {
      snippet = " " + snippet;
      corrimiento = 1;
    }
    if (despues.startsWith("$")) {
      snippet = snippet + " ";
    }

    const nuevoValor = antes + snippet + despues;
    const gap = item.cursorGap !== undefined ? item.cursorGap : item.latex.length + 2;
    const cursorPos = start + corrimiento + gap;

    if (esPregunta) {
      setTexto(nuevoValor);
    } else {
      setRespuestas((prev) => {
        const copia = [...prev];
        copia[activeField.index] = nuevoValor;
        return copia;
      });
    }

    setPendingCursor({ esPregunta, index: activeField.index, pos: cursorPos });
  };

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
    <div className="tv-panel mt-3">
      <label className="tv-label">📝 Nueva pregunta</label>

      <div className="tv-symbol-row">
        {SIMBOLOS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="tv-symbol-btn"
            title={item.title}
            onMouseDown={(e) => e.preventDefault()} // conserva el foco/cursor del campo activo
            onClick={() => insertSnippet(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="tv-text-muted small mb-2">
        Insertando símbolos en:{" "}
        <strong>
          {activeField.type === "pregunta" ? "la pregunta" : `respuesta ${activeField.index + 1}`}
        </strong>
      </p>

      <textarea
        ref={preguntaRef}
        rows={2}
        className="tv-input tv-textarea mb-2"
        placeholder="Ej: Calcula el área si $x^2 + \sqrt{y}$..."
        value={texto}
        onFocus={() => setActiveField({ type: "pregunta" })}
        onChange={(e) => setTexto(e.target.value)}
      />
      {texto && (
        <div className="tv-preview mb-3">
          <small className="tv-text-muted d-block mb-1">Vista previa:</small>
          <MathViewer text={texto} />
        </div>
      )}

      {respuestas.map((r, i) => (
        <div key={i} className="mb-2">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`tv-option-dot ${COLORES[i]} ${correcta === i ? "tv-is-correct" : ""}`}
              onClick={() => setCorrecta(i)}
              title="Marcar como correcta"
            >
              {correcta === i ? "✓" : i + 1}
            </button>
            <input
              type="text"
              ref={(el) => (respuestaRefs.current[i] = el)}
              className="tv-input"
              placeholder={`Respuesta ${i + 1} (ej: $\\sqrt{16}$)`}
              value={r}
              onFocus={() => setActiveField({ type: "respuesta", index: i })}
              onChange={(e) => {
                const copia = [...respuestas];
                copia[i] = e.target.value;
                setRespuestas(copia);
              }}
            />
          </div>
          {r && (
            <div className="tv-preview mt-1" style={{ marginLeft: "2.9rem" }}>
              <small className="tv-text-muted me-2">Vista previa:</small>
              <MathViewer text={r} />
            </div>
          )}
        </div>
      ))}

      <button className="tv-btn tv-btn-secondary tv-btn-block mt-3" onClick={agregar}>
        ➕ Agregar pregunta
      </button>
    </div>
  );
}

export default PreguntaForm;
