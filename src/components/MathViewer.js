import React, { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// Soporta las dos convenciones de delimitadores más comunes:
//   $...$ / $$...$$   (Markdown/KaTeX clásico)
//   \(...\) / \[...\] (LaTeX estándar, típico al pegar texto de ChatGPT/Word)
const MATH_DELIMITERS = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^$]+?\$|\\\([\s\S]+?\\\))/g;

function MathViewer({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const normalized = text ?? "";
    const parts = normalized.split(MATH_DELIMITERS);
    containerRef.current.innerHTML = "";

    parts.forEach((part) => {
      const span = document.createElement("span");

      const esDisplayDolar = part.startsWith("$$") && part.endsWith("$$") && part.length > 4;
      const esDisplayCorchete = part.startsWith("\\[") && part.endsWith("\\]") && part.length > 4;
      const esInlineDolar = part.startsWith("$") && part.endsWith("$") && part.length > 2;
      const esInlineParentesis = part.startsWith("\\(") && part.endsWith("\\)") && part.length > 4;

      if (esDisplayDolar || esDisplayCorchete) {
        try {
          katex.render(part.slice(2, -2), span, {
            throwOnError: false,
            displayMode: true,
          });
        } catch {
          span.textContent = part;
        }
      } else if (esInlineParentesis) {
        try {
          katex.render(part.slice(2, -2), span, { throwOnError: false });
        } catch {
          span.textContent = part;
        }
      } else if (esInlineDolar) {
        try {
          katex.render(part.slice(1, -1), span, { throwOnError: false });
        } catch {
          span.textContent = part;
        }
      } else {
        span.textContent = part;
      }

      containerRef.current.appendChild(span);
    });
  }, [text]);

  return <span ref={containerRef} />;
}

export default MathViewer;
