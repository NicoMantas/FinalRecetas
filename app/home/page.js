"use client";

import { useRouter } from "next/navigation"; /*al importar useRouter, se puede usar para redirigir a una página*/
import { useState, useRef, useEffect } from "react";
import withAuth from "../components/withAuth"; // Importar el HOC

function HomePage() {
  const router = useRouter(); /* se debe inicializar el router*/
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 300); // 300ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Hamburger Menu Button */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed top-4 left-4 z-50"
      >
        <button className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors duration-200">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed left-0 top-0 h-full bg-orange-600 text-white flex flex-col py-6 px-4 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        {/* Logo/Title */}
        <div
          className={`text-center text-2xl font-bold mb-8 border-b border-orange-500 pb-4 whitespace-nowrap ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          Reco Menu
        </div>

        {/* Navigation Buttons */}
        <nav
          className={`flex flex-col space-y-4 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <button
            className="flex items-center px-4 py-3 rounded-lg hover:bg-orange-500 transition-colors duration-200 whitespace-nowrap"
            title="Home"
            onClick={() => router.push("/home")}
          >
            <span>🏠</span>
            <span className="ml-3">Home</span>
          </button>
          <button
            className="flex items-center px-4 py-3 rounded-lg hover:bg-orange-500 transition-colors duration-200 whitespace-nowrap"
            title="Crear Recetas"
            onClick={() => router.push("/create-recipe")}
          >
            <span>📝</span>
            <span className="ml-3">Crear Receta</span>
          </button>
          <button
            className="flex items-center px-4 py-3 rounded-lg hover:bg-orange-500 transition-colors duration-200 whitespace-nowrap"
            title="Lista"
            onClick={() => router.push("/inventory")}
          >
            <span>📋</span>
            <span className="ml-3">Lista</span>
          </button>
          <button
            className="flex items-center px-4 py-3 rounded-lg hover:bg-orange-500 transition-colors duration-200 whitespace-nowrap"
            title="Challenge"
            onClick={() => router.push("/challenge")}
          >
            <span>🏆</span>
            <span className="ml-3">Challenge</span>
          </button>
          <button
            className="flex items-center px-4 py-3 rounded-lg hover:bg-orange-500 transition-colors duration-200 whitespace-nowrap"
            title="Estadísticas"
            onClick={() => router.push("/statistics")}
          >
            <span>📊</span>
            <span className="ml-3">Estadísticas</span>
          </button>
          <button
            className="flex items-center px-4 py-3 rounded-lg hover:bg-orange-500 transition-colors duration-200 whitespace-nowrap"
            title="Perfil"
            onClick={() => router.push("/profile")}
          >
            <span>👤</span>
            <span className="ml-3">Perfil Usuario</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 bg-orange-200 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-center items-center gap-4">
            <div className="text-xl font-bold text-orange-600">
              Welcome Reco Page
            </div>
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
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">
                Pastas
              </button>
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">
                Desserts
              </button>
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">
                Favourite
              </button>
              <button className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700">
                Favourite
              </button>
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
                <div
                  key={i}
                  className="bg-white rounded-lg shadow p-2 text-center"
                >
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

export default withAuth(HomePage); // Exportar el componente envuelto
