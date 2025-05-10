'use client';

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-45 bg-orange-600 text-white flex flex-col justify-between py-6 px-2">
  {/* Parte superior (título o logo si deseas) */}
  <div className="text-center text-xl font-bold mb-4">Menu</div>

  {/* Botones centrados verticalmente y distribuidos */}
  <div className="flex flex-col flex-grow justify-evenly items-center space-y-4">
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" title="Crear Recetas">
      Crear Receta
    </button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" title="Estadísticas">
      Estadísticas
    </button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" title="Home" onClick={() => console.log("Este es el Home")}>
      Home
    </button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" title="Lista">
      Lista
    </button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" title="Challenge">
      Challenge
    </button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" title="Perfil">
      Perfil Usuario
    </button>
  </div>
</aside>


      {/* Main Content */}
      <main className="flex-1 p-8 bg-orange-200">
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-center items-center gap-4">
            <div className="text-xl font-bold text-orange-600">Welcome Reco Page</div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span>Icon</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search for recipe and ingredients"
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Search
            </button>
          </div>

          {/* Challenge of the Day */}
          <div className="bg-orange-100 p-4 rounded-xl shadow text-center">
            <p className="text-gray-700 font-semibold">Challenge of Day</p>
          </div>

          {/* Most Frequent Searches */}
          <div>
            <h2 className="text-center text-lg font-bold text-gray-800 mb-4">
              Searches Most Frequent This Week
            </h2>
            <div className="flex justify-center gap-4">
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">Pastas</button>
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">Desserts</button>
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">Favourite</button>
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">Favourite</button>
            </div>
          </div>

          {/* Discover New Recipes */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Find out new Recipes"
              className="w-full px-4 py-2 border rounded-lg shadow-sm"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-2 text-center">
                  <div className="w-full h-24 bg-gray-300 rounded-lg mb-2">
                    {/* Imagen de receta */}
                  </div>
                  <div className="text-sm font-medium">Name Food</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <input
              type="text"
              placeholder="Description About Page"
              className="w-full px-4 py-2 border rounded-lg shadow-sm"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
