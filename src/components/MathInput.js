// src/components/MathInput.js
// Campo de edición matemática WYSIWYG: nunca se ve código LaTeX crudo,
// solo el resultado formateado con un cursor real navegable (usa MathLive).
import React, { useEffect, useRef } from "react";
import "mathlive";

function MathInput({ value, onChange, placeholder, className = "", onFocusField, onBlurField, mfRef }) {
  const localRef = useRef(null);
  const ref = mfRef || localRef;

  // Sincroniza el valor externo (ej: reset del formulario) sin pisar
  // lo que el usuario está escribiendo si el valor ya coincide.
  useEffect(() => {
    const mf = ref.current;
    if (mf && mf.value !== value) {
      mf.value = value || "";
    }
  }, [value, ref]);

  useEffect(() => {
    const mf = ref.current;
    if (!mf) return;

    mf.setAttribute("math-virtual-keyboard-policy", "manual");
    if (placeholder) mf.setAttribute("placeholder", placeholder);

    const handleInput = () => onChange(mf.value);
    const handleFocus = () => {
      window.mathVirtualKeyboard.container = document.body;
      window.mathVirtualKeyboard.show({ animate: true });
      onFocusField && onFocusField();
    };
    const handleBlur = () => {
      onBlurField && onBlurField();
    };

    mf.addEventListener("input", handleInput);
    mf.addEventListener("focus", handleFocus);
    mf.addEventListener("blur", handleBlur);
    return () => {
      mf.removeEventListener("input", handleInput);
      mf.removeEventListener("focus", handleFocus);
      mf.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, onFocusField, onBlurField, placeholder]);

  return <math-field ref={ref} class={`tv-math-input ${className}`}></math-field>;
}

export default MathInput;
