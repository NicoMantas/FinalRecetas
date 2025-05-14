"use client"; /*se debe usar use client para que el componente se renderice en el cliente*/
import withAuth from "../components/withAuth"; // Importar el HOC
import CollapsibleSidebarLayout from '../components/CollapsibleSidebarLayout'; // Added import
// Consider adding a charting library like Chart.js or Recharts for more advanced visualizations

// Mock data for statistics (replace with actual data fetching and processing)
const userStats = {
  recipesCreated: 12,
  recipesFavorited: 45,
  challengesCompleted: 5,
  averageRatingReceived: 4.7,
  mostActiveDay: "Miércoles",
  favoriteCategory: "Postres",
  // Example data for a simple chart (e.g., recipes created per month)
  monthlyCreations: [
    { month: "Ene", count: 2 },
    { month: "Feb", count: 3 },
    { month: "Mar", count: 1 },
    { month: "Abr", count: 4 },
    { month: "May", count: 2 }, // Current month (assuming)
  ],
};

function StatisticsPage() {
  // For more complex charts, you would process data here or fetch it
  const maxMonthlyCreation = Math.max(...userStats.monthlyCreations.map(m => m.count), 0) || 5; // Ensure not 0 for division

  return (
    <CollapsibleSidebarLayout>
      <div className="p-4 md:p-8"> {/* Main content padding */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-700">Tus Estadísticas Culinarias</h1>
          <p className="text-lg text-orange-600 mt-1">Un resumen de tu actividad y logros en ReinventandoCocina.</p>
        </header>

        {/* Grid for key statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <h2 className="text-4xl font-bold text-orange-500">{userStats.recipesCreated}</h2>
            <p className="text-gray-600 mt-1">Recetas Creadas</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <h2 className="text-4xl font-bold text-orange-500">{userStats.recipesFavorited}</h2>
            <p className="text-gray-600 mt-1">Recetas Favoritas</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <h2 className="text-4xl font-bold text-orange-500">{userStats.challengesCompleted}</h2>
            <p className="text-gray-600 mt-1">Desafíos Completados</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <h2 className="text-4xl font-bold text-orange-500">
              {userStats.averageRatingReceived.toFixed(1)} <span className="text-2xl">⭐</span>
            </h2>
            <p className="text-gray-600 mt-1">Valoración Promedio</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-orange-500">{userStats.mostActiveDay}</h2>
            <p className="text-gray-600 mt-1">Día Más Activo</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-orange-500">{userStats.favoriteCategory}</h2>
            <p className="text-gray-600 mt-1">Categoría Favorita</p>
          </div>
        </div>

        {/* Section for Charts - Placeholder for more advanced charts */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-orange-700 mb-6 text-center">Actividad Mensual (Recetas Creadas)</h2>
          {userStats.monthlyCreations.length > 0 ? (
            <div className="flex justify-around items-end h-64 bg-orange-50 p-4 rounded-lg border border-orange-200">
              {userStats.monthlyCreations.map((data) => (
                <div key={data.month} className="flex flex-col items-center w-1/6">
                  <div
                    className="w-10 md:w-12 bg-orange-400 hover:bg-orange-500 transition-colors rounded-t-md"
                    style={{ height: `${(data.count / maxMonthlyCreation) * 100}%` }}
                    title={`${data.count} recetas`}
                  ></div>
                  <p className="text-xs md:text-sm text-gray-600 mt-2">{data.month}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">No hay suficientes datos para mostrar el gráfico de actividad.</p>
          )}
          <p className="text-sm text-gray-500 mt-4 text-center">*Gráfico simplificado. Considera una librería de gráficos para visualizaciones más detalladas.</p>
        </div>

        {/* Placeholder for other types of charts or statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-orange-700 mb-4">Participación en Desafíos</h3>
                {/* Placeholder for a pie chart or detailed stats */}
                <div className="flex items-center justify-center h-40 bg-orange-50 rounded-lg border border-orange-200">
                    <svg width="80" height="80" viewBox="0 0 36 36" className="text-orange-400">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3.8" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeDasharray="60, 100" strokeDashoffset="-25" />
                        <text x="18" y="20.35" className="fill-current text-xs font-semibold" textAnchor="middle">60%</text>
                    </svg>
                </div>
                 <p className="text-sm text-gray-500 mt-3 text-center">60% de desafíos semanales completados.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-orange-700 mb-4">Popularidad de Tus Recetas</h3>
                {/* Placeholder for top recipes or average views */}
                <div className="text-center py-4">
                    <p className="text-gray-600"><span className="font-bold text-orange-500">"Tarta de Limón Celestial"</span> es tu receta más vista este mes.</p>
                    <p className="text-sm text-gray-500 mt-2">1,200 vistas | 85 favoritos</p>
                </div> 
            </div>
        </div>

      </div>
    </CollapsibleSidebarLayout>
  );
}

export default withAuth(StatisticsPage); // Exportar componente envuelto
