import React, { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function MathViewer({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const parts = text.split(/(\$.*?\$)/g);
    containerRef.current.innerHTML = "";

    parts.forEach((part) => {
      const span = document.createElement("span");

      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
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
