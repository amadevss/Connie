import React, { useState } from "react";

const situacionesEjemplo = [
  "Un niño perdió su juguete favorito.",
  "Una niña ganó un premio en la escuela.",
  "Un amigo se cayó y se lastimó la rodilla.",
  "Alguien comparte su merienda contigo.",
];

const emociones = [
  { emoji: "😊", label: "Feliz" },
  { emoji: "😢", label: "Triste" },
  { emoji: "😡", label: "Enojado" },
  { emoji: "😱", label: "Sorprendido" },
  { emoji: "😨", label: "Asustado" },
  { emoji: "😃", label: "Emocionado" },
];

export default function JuegoEmociones({ onContinue }) {
  const [situacion] = useState(situacionesEjemplo[Math.floor(Math.random() * situacionesEjemplo.length)]);
  const [emocion, setEmocion] = useState("");
  const [respuesta, setRespuesta] = useState("");

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 p-8 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
      <h2 className="text-2xl font-bold text-center text-orange-700 dark:text-orange-300 mb-2">Juego de Emociones</h2>
      <div className="text-center text-lg text-gray-800 dark:text-gray-100 mb-4">
        <span className="font-semibold">Situación:</span> {situacion}
      </div>
      <div className="flex flex-wrap justify-center gap-3 mb-2">
        {emociones.map(e => (
          <button
            key={e.label}
            className={`text-3xl px-3 py-2 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400
              ${emocion === e.label ? "border-orange-500 bg-orange-100 dark:bg-orange-800" : "border-transparent"}`}
            onClick={() => setEmocion(e.label)}
            aria-label={e.label}
          >
            {e.emoji}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-200">¿Qué podrías hacer para ayudar o mejorar la situación?</span>
        <input
          className="rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 focus:ring-2 focus:ring-orange-400 dark:bg-zinc-800 dark:text-white"
          value={respuesta}
          onChange={e => setRespuesta(e.target.value)}
          placeholder="Escribe tu respuesta..."
        />
      </label>
      <button
        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        onClick={() => onContinue({ situacion, emocion, respuesta })}
        disabled={!emocion || !respuesta}
      >
        Continuar
      </button>
    </div>
  );
} 