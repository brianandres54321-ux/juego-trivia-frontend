// src/components/PreguntaForm.js
import React, { useEffect, useRef, useState } from "react";
import MathViewer from "./MathViewer";
import MathInput from "./MathInput";

const COLORES = ["tv-shape-triangle", "tv-shape-diamond", "tv-shape-circle", "tv-shape-square"];

// Las respuestas se guardan siempre envueltas en "$...$" para que el resto
// de la app (Juego, ResultadoPregunta, SalaEspera) las renderice con KaTeX.
// MathInput solo trabaja con el LaTeX "pelado" (sin los delimitadores).
function pelarDolares(s) {
  if (!s) return "";
  const t = s.trim();
  if (t.startsWith("$") && t.endsWith("$") && t.length > 1) return t.slice(1, -1);
  return s;
}
function envolverDolares(latex) {
  return latex ? `$${latex}$` : "";
}

function PreguntaForm({ onAgregar }) {
  const [texto, setTexto] = useState("");
  const [respuestas, setRespuestas] = useState(["", "", "", ""]);
  const [correcta, setCorrecta] = useState(null);

  // Campo de la pregunta: se ve renderizado (como la vista previa) y solo se
  // convierte en texto editable al hacer clic; al salir vuelve a renderizarse.
  const [editandoPregunta, setEditandoPregunta] = useState(true);
  const preguntaRef = useRef(null);

  // Popover para insertar una fórmula matemática dentro de la pregunta,
  // compuesta de forma 100% visual (sin escribir código LaTeX a mano).
  const [formulaAbierta, setFormulaAbierta] = useState(false);
  const [formulaValor, setFormulaValor] = useState("");

  // Si el campo pasa a modo edición sin que el usuario haya hecho clic
  // directamente en él (ej: tras insertar una fórmula), hay que enfocarlo
  // "de verdad" o el próximo blur nunca dispara y queda trabado mostrando
  // el texto crudo en vez de volver al renderizado.
  useEffect(() => {
    if (editandoPregunta && preguntaRef.current && document.activeElement !== preguntaRef.current) {
      const nodo = preguntaRef.current;
      const fin = texto.length;
      nodo.focus();
      nodo.setSelectionRange(fin, fin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editandoPregunta]);

  const activarEdicionPregunta = () => setEditandoPregunta(true);

  const abrirInsertarFormula = () => {
    setFormulaValor("");
    setFormulaAbierta(true);
  };

  const confirmarFormula = () => {
    const node = preguntaRef.current;
    const snippet = envolverDolares(formulaValor);
    if (!snippet) {
      setFormulaAbierta(false);
      return;
    }

    if (node && editandoPregunta) {
      const start = typeof node.selectionStart === "number" ? node.selectionStart : texto.length;
      const end = typeof node.selectionEnd === "number" ? node.selectionEnd : texto.length;
      const antes = texto.slice(0, start);
      const despues = texto.slice(end);
      const necesitaEspacioAntes = antes.length > 0 && !/\s$/.test(antes);
      const necesitaEspacioDespues = despues.length > 0 && !/^\s/.test(despues);
      const nuevoValor =
        antes + (necesitaEspacioAntes ? " " : "") + snippet + (necesitaEspacioDespues ? " " : "") + despues;
      setTexto(nuevoValor);
    } else {
      // No había foco previo en el campo: se agrega al final.
      const necesitaEspacio = texto.length > 0 && !/\s$/.test(texto);
      setTexto(texto + (necesitaEspacio ? " " : "") + snippet);
    }

    setEditandoPregunta(true);
    setFormulaAbierta(false);
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
    setEditandoPregunta(true);
  };

  return (
    <div className="tv-panel mt-3">
      <label className="tv-label">📝 Nueva pregunta</label>

      {editandoPregunta || !texto.trim() ? (
        <textarea
          ref={preguntaRef}
          rows={2}
          className="tv-input tv-textarea mb-2"
          placeholder="Ej: Calcula el área si $x^2 + \sqrt{y}$... (usa el botón de fórmula para insertar matemática)"
          value={texto}
          onFocus={activarEdicionPregunta}
          onBlur={() => setEditandoPregunta(false)}
          onChange={(e) => setTexto(e.target.value)}
        />
      ) : (
        <div
          className="tv-input tv-textarea tv-editable-preview mb-2"
          role="button"
          tabIndex={0}
          onClick={activarEdicionPregunta}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && activarEdicionPregunta()}
        >
          <MathViewer text={texto} />
        </div>
      )}

      <div className="mb-3">
        <button type="button" className="tv-btn tv-btn-ghost tv-btn-sm" onClick={abrirInsertarFormula}>
          ➕ √ Insertar fórmula
        </button>

        {formulaAbierta && (
          <div className="tv-formula-popover mt-2">
            <p className="tv-label mb-2">Escribe la fórmula (se ve formateada mientras escribís):</p>
            <MathInput value={formulaValor} onChange={setFormulaValor} placeholder="x^2+\sqrt{y}" />
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="tv-btn tv-btn-ghost tv-btn-sm"
                onClick={() => setFormulaAbierta(false)}
              >
                Cancelar
              </button>
              <button type="button" className="tv-btn tv-btn-secondary tv-btn-sm" onClick={confirmarFormula}>
                Insertar en la pregunta
              </button>
            </div>
          </div>
        )}
      </div>

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
            <MathInput
              value={pelarDolares(r)}
              placeholder={`\\text{Respuesta ${i + 1}}`}
              onChange={(latex) => {
                const copia = [...respuestas];
                copia[i] = envolverDolares(latex);
                setRespuestas(copia);
              }}
            />
          </div>
        </div>
      ))}

      <button className="tv-btn tv-btn-secondary tv-btn-block mt-3" onClick={agregar}>
        ➕ Agregar pregunta
      </button>
    </div>
  );
}

export default PreguntaForm;
