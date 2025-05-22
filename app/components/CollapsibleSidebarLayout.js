'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function CollapsibleSidebarLayout({ children }) {
  const router = useRouter();
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
    // Clear timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Hamburger Menu Button & Sidebar Area */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* Hamburger Menu Button - positioned fixed */}
        <div className="fixed top-4 left-4 z-50">
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
          className={`fixed left-0 top-0 h-full bg-orange-600 text-white flex flex-col py-6 px-4 shadow-lg transition-all duration-300 ease-in-out overflow-y-auto ${
            isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
          }`}
        >
          <div
            className={`text-center text-2xl font-bold mb-8 border-b border-orange-500 pb-4 whitespace-nowrap ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            Reco Menu
          </div>
          <nav
            className={`flex flex-col space-y-4 flex-grow ${
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
              title="Lista de Recetas"
              onClick={() => router.push("/inventory")}
            >
              <span>📋</span>
              <span className="ml-3">Inventario</span>
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
            {/* Perfil Usuario button at the bottom of the scrollable nav area */}
          </nav>
          <div className={`mt-auto ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}>
            <button
                className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-orange-500 transition-colors duration-200 whitespace-nowrap"
                title="Perfil"
                onClick={() => router.push("/profile")}
              >
                <span>👤</span>
                <span className="ml-3">Perfil Usuario</span>
              </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
        style={{ backgroundColor: '#f68706' }}
      >
        {children}
      </main>
    </div>
  );
}

export default CollapsibleSidebarLayout; 