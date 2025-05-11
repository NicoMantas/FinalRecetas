"use client";

export default function ChallengePage() {
  // aca se define el reto del dia, luego se debemos usar la api de gmini ia para obtener el reto del dia
  const challenge = {
    name: "Reto del Día: Pasta Creativa",
    description:
      "¡Pon a prueba tu creatividad en la cocina! Cada día tendrás un reto con ingredientes y reglas específicas. Tu misión: crear una receta deliciosa siguiendo las pautas.",
    mainIngredients: ["Pasta", "Tomate", "Albahaca"],
    timeLimit: "40 minutos",
    bonusRule: "Debe incluir una salsa casera",
    rules: [
      "Usa todos los ingredientes principales.",
      "Puedes agregar hasta 3 ingredientes extra.",
      "Nada de alimentos pre-hechos o procesados.",
      "Comparte una foto y una breve descripción de tu plato.",
      "¡Diviértete y experimenta con sabores!",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 py-8 px-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-pink-200">
        <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-2">
          Reto Diario de Cocina
        </h1>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          {challenge.name}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {challenge.description}
        </p>
        <div className="bg-pink-50 rounded-lg p-4 mb-6 border border-pink-100">
          <h3 className="font-bold text-pink-500 mb-2">
            🔥 Ingredientes Principales:
          </h3>
          <ul className="list-disc list-inside text-gray-700 mb-2">
            {challenge.mainIngredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <p className="mb-1">
            <span className="font-semibold">⏰ Tiempo límite:</span>{" "}
            {challenge.timeLimit}
          </p>
          <p>
            <span className="font-semibold">🎁 Regla extra:</span>{" "}
            {challenge.bonusRule}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-2">📋 Reglas Generales</h3>
          <ul className="list-decimal list-inside text-gray-600">
            {challenge.rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>
        <button className="w-full py-3 mt-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg shadow transition">
          ¡Participar y Compartir!
        </button>
      </div>
      <p className="mt-6 text-sm text-gray-400">
        ¿Listo para el reto de hoy? ¡Sigue las reglas y comparte tu creación!
        🍝🔥
      </p>
    </div>
  );
}
