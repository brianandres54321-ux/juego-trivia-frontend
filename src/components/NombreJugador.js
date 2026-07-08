import React, { useState } from "react";

function NombreJugador({ onJoin }) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin({ nombre, codigo });
  };

  return (
    <div className="container text-center mt-5">
      <h2>Bienvenido a Trivia 🎯</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Código de sala (opcional)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button className="btn btn-primary w-100" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default NombreJugador;
