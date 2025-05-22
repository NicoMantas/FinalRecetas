"use client";
import withAuth from "../components/withAuth";
import CollapsibleSidebarLayout from '../components/CollapsibleSidebarLayout';

function ChallengePage() {
  // TODO: This should be fetched from a backend/API, perhaps using Gemini for dynamic challenges
  const challenge = {
    id: "daily_pasta_challenge_001", // Added an ID for potential future use (e.g., submissions)
    name: "Reto del Día: Pasta Creativa Excepcional",
    description:
      "¡Demuestra tu maestría culinaria! Cada día te espera un nuevo desafío con ingredientes y reglas específicas. Tu misión: crear una receta innovadora y deliciosa que cumpla con las pautas.",
    mainIngredients: ["Pasta Fresca (o seca de buena calidad)", "Tomates Cherry Maduros", "Albahaca Fresca"],
    timeLimit: "45 minutos",
    bonusRule: "Debe incluir un toque crujiente (ej: pan rallado tostado, nueces, etc.)",
    rules: [
      "Utiliza todos los ingredientes principales.",
      "Puedes añadir hasta 3 ingredientes adicionales para realzar tu plato.",
      "Se valorará la presentación y originalidad de la receta.",
      "No se permiten ingredientes pre-cocidos (excepto la pasta si es seca).",
      "Comparte una foto de alta calidad y una descripción detallada de tu proceso y plato final.",
      "¡Diviértete, experimenta y sorprende a la comunidad!",
    ],
    submissionDeadline: "Final del día (medianoche, hora local)", // Added submission deadline
    judgeCriteria: [ // Added judging criteria for clarity
        "Sabor y Armonía de Ingredientes",
        "Creatividad y Originalidad",
        "Presentación del Plato",
        "Cumplimiento de Reglas y Uso de Ingredientes Principales"
    ]
  };

  // TODO: Add state and handlers for user submissions (e.g., text, image upload)

  return (
    <CollapsibleSidebarLayout>
      <div className="p-4 md:p-8"> {/* Adjusted padding, removed theme background */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
              Desafío Culinario del Día
            </h1>
            <h2 className="text-2xl font-semibold text-orange-500">
              {challenge.name}
            </h2>
          </header>

          <section className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {challenge.description}
            </p>
          </section>

          <section className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-orange-700 mb-3 border-b pb-2 border-orange-200">Detalles del Reto:</h3>
            <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold text-orange-600">🌿 Ingredientes Principales:</span> {challenge.mainIngredients.join(', ')}</p>
                <p><span className="font-semibold text-orange-600">⏱️ Límite de Tiempo:</span> {challenge.timeLimit}</p>
                <p><span className="font-semibold text-orange-600">🌟 Regla de Bonificación:</span> {challenge.bonusRule}</p>
                <p><span className="font-semibold text-orange-600">🗓️ Límite de Entrega:</span> {challenge.submissionDeadline}</p>
            </div>
          </section>

          <section className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2 border-gray-200">📋 Reglas Generales:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
              {challenge.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </section>
          
          <section className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2 border-gray-200">🏆 Criterios de Evaluación:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
              {challenge.judgeCriteria.map((criterion, i) => (
                <li key={i}>{criterion}</li>
              ))}
            </ul>
          </section>

          {/* TODO: Add form for challenge submission here */}
          <div className="text-center pt-4">
            <button 
                // onClick={() => {/* Handle participation logic */}}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              ¡Aceptar el Reto y Participar!
            </button>
          </div>

          <footer className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              ¿Listo para el reto de hoy? ¡Sigue las reglas y comparte tu creación! 🍝🔥
            </p>
          </footer>
        </div>
      </div>
    </CollapsibleSidebarLayout>
  );
}

export default withAuth(ChallengePage);
