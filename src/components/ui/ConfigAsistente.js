import React, { useState } from "react";

export default function ConfigAsistente({ onContinue }) {
  const [nombre, setNombre] = useState("");
  const [intereses, setIntereses] = useState("");
  const [tono, setTono] = useState("amigable");

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 p-8 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
      <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300 mb-2">Configura tu asistente</h2>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Nombre del asistente</span>
        <input
          className="rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ejemplo: Max, Lila, etc."
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Intereses</span>
        <input
          className="rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white"
          value={intereses}
          onChange={e => setIntereses(e.target.value)}
          placeholder="Ejemplo: animales, ciencia, arte..."
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Tono de personalidad</span>
        <select
          className="rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white"
          value={tono}
          onChange={e => setTono(e.target.value)}
        >
          <option value="amigable">Amigable</option>
          <option value="divertido">Divertido</option>
          <option value="serio">Serio</option>
          <option value="curioso">Curioso</option>
        </select>
      </label>
      <button
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        onClick={() => onContinue({ nombre, intereses, tono })}
        disabled={!nombre}
      >
        Continuar
      </button>
    </div>
  );
} 