import React, { useState } from "react";

const niveles = [
  { value: "preescolar", label: "Preescolar" },
  { value: "primaria", label: "Primaria" },
  { value: "secundaria", label: "Secundaria" },
];

const temas = [
  "Animales", "Colores", "Números", "Familia", "Comida", "Escuela", "Juegos", "Cuerpo", "Ropa"
];

export default function ConfigIngles({ onContinue }) {
  const [nivel, setNivel] = useState("preescolar");
  const [tema, setTema] = useState("");

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 p-8 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
      <h2 className="text-2xl font-bold text-center text-cyan-700 dark:text-cyan-300 mb-2">Configura tu clase de inglés</h2>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Nivel educativo</span>
        <select
          className="rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-cyan-400 dark:bg-zinc-800 dark:text-white"
          value={nivel}
          onChange={e => setNivel(e.target.value)}
        >
          {niveles.map(n => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Tema (opcional)</span>
        <select
          className="rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-cyan-400 dark:bg-zinc-800 dark:text-white"
          value={tema}
          onChange={e => setTema(e.target.value)}
        >
          <option value="">Cualquier tema</option>
          {temas.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <button
        className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        onClick={() => onContinue({ nivel, tema })}
      >
        Continuar
      </button>
    </div>
  );
} 