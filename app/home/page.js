"use client";

/**
 * Página principal de la aplicación RecoMenu.
 * Esta página permite al usuario:
 * - Navegar entre secciones usando la barra lateral desplegable.
 * - Ver un reto del día.
 * - Filtrar búsquedas por categorías frecuentes (como "Pastas", "Postres", etc.).
 * - Ver una lista de recetas descubiertas recientemente (nombre y tipo).
 * - Buscar recetas manualmente (campo de búsqueda).
 * - Está protegida por autenticación (usando HOC withAuth).
 */

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
// Image import removed as per request
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase.js';
import withAuth from "../components/withAuth"; // Protección con autenticación

// Example Icon (replace with actual icons if you have a library)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const ChallengeIcon = () => (
  <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
  </svg>
);

function HomePage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const timeoutRef = useRef(null);
  const [discoveredRecipes, setDiscoveredRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [recipeListTitle, setRecipeListTitle] = useState("Descubre Nuevas Recetas");

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Moved fetchRecipes outside of useEffect to be callable by handlers
  const fetchRecipes = async (searchQuery = null) => {
    setIsLoadingRecipes(true);
    setDiscoveredRecipes([]); 

    try {
      const recipesCollectionRef = collection(db, 'recipes');
      
      if (searchQuery && searchQuery.trim() !== "") {
        setRecipeListTitle(`Resultados para "${searchQuery}"`);
        
        // Case-insensitive search for name and title
        // Firestore doesn't support case-insensitive "starts-with" queries directly.
        // A common workaround is to store a lowercase version of the fields you want to search
        // or fetch and filter client-side for small datasets.
        // For this implementation, we'll stick to case-sensitive "starts-with" for simplicity,
        // as Firestore's default behavior with string comparisons is case-sensitive.
        // The category search will be case-sensitive exact match.
        
        const searchTermLower = searchQuery.toLowerCase(); // For potential client-side filtering if needed
        const searchTermUpper = searchQuery.toUpperCase(); // For potential client-side filtering if needed
        // It's better to handle case consistently during data entry or use more complex querying if strict case-insensitivity is required.
        // For now, we search based on the exact case provided by the user for starts-with,
        // and exact match for category.

        const nameQuery = query(recipesCollectionRef, 
                                where("name", ">=", searchQuery), 
                                where("name", "<=", searchQuery + '\\uf8ff'));
        const titleQuery = query(recipesCollectionRef, 
                                 where("title", ">=", searchQuery), 
                                 where("title", "<=", searchQuery + '\\uf8ff'));
        // For category, it's good to ensure the case matches how it's stored or search multiple cases.
        // Assuming categories are stored with first letter capitalized or as entered.
        const categoryQuery = query(recipesCollectionRef, 
                                    where("category", "==", searchQuery));

        const [nameSnapshot, titleSnapshot, categorySnapshot] = await Promise.all([
          getDocs(nameQuery),
          getDocs(titleQuery),
          getDocs(categoryQuery)
        ]);

        const recipesMap = new Map();
        const processSnapshot = (snapshot) => {
          snapshot.forEach(doc => {
            // Basic check if data is suitable, e.g. has a name or title
            const data = doc.data();
            if (data.name || data.title) { // Ensure there's a displayable name
                 recipesMap.set(doc.id, { id: doc.id, ...data });
            }
          });
        };

        processSnapshot(nameSnapshot);
        processSnapshot(titleSnapshot);
        processSnapshot(categorySnapshot);
        
        const results = Array.from(recipesMap.values());
        setDiscoveredRecipes(results);
        if (results.length === 0) {
            setRecipeListTitle(`No hay resultados para "${searchQuery}"`);
        }

      } else {
        setRecipeListTitle("Descubre Nuevas Recetas");
        // Fetch initial/default recipes (e.g., latest 6)
        const q = query(recipesCollectionRef, limit(6)); // Consider adding orderBy('createdAt', 'desc')
        const querySnapshot = await getDocs(q);
        const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDiscoveredRecipes(recipesData);
      }
    } catch (error) {
      console.error("Error fetching recipes: ", error);
      setDiscoveredRecipes([]); 
      setRecipeListTitle("Error al cargar recetas");
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // useEffect for initial data load
  useEffect(() => {
    fetchRecipes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipes(mainSearchQuery); 
  };

  // Fixed page description
  const fixedPageDescription = "Bienvenido a tu panel de RecoMenu. Aquí puedes gestionar tus recetas, descubrir nuevas inspiraciones culinarias, y participar en retos emocionantes. ¡Explora, crea y comparte tu pasión por la cocina!";

  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Botón del menú hamburguesa */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed top-4 left-4 z-50"
      >
        <button className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar de navegación */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed left-0 top-0 h-full bg-orange-600 text-white flex flex-col py-6 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? "w-64 translate-x-0 px-4" : "w-0 -translate-x-full px-0"}`}
      >
        <div className={`text-center text-2xl font-bold mb-8 border-b border-orange-500 pb-4 whitespace-nowrap ${isSidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
          Reco Menu
        </div>
        <nav className={`flex flex-col space-y-3 ${isSidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
          {[
            { path: "/home", label: "Home", icon: "🏠" },
            { path: "/create-recipe", label: "Crear Receta", icon: "📝" },
            { path: "/inventory", label: "Inventario", icon: "📋" },
            { path: "/challenge", label: "Challenge", icon: "🏆" },
            { path: "/statistics", label: "Estadísticas", icon: "📊" },
            { path: "/profile", label: "Perfil Usuario", icon: "👤" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex items-center px-3 py-2.5 rounded-lg hover:bg-orange-700 text-sm transition-colors duration-200 whitespace-nowrap w-full text-left"
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className={`flex-1 p-6 sm:p-10 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 md:space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">
              Bienvenido a Reco Page
            </h1>
            <div className="text-4xl">🍽️</div>
          </div>

          {/* Buscador Principal */}
          <form onSubmit={handleSearchSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
            <input
              type="text"
              value={mainSearchQuery}
              onChange={(e) => setMainSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o tipo de receta..."
              className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg 
              shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
              text-base sm:text-lg text-black/80"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg text-base sm:text-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <SearchIcon />
              Buscar
            </button>
          </form>

          {/* Reto del día */}
          <div className="bg-orange-100 p-6 rounded-xl shadow-md flex items-center">
            <ChallengeIcon />
            <div>
              <h2 className="text-xl font-semibold text-orange-700 mb-1">Reto del Día</h2>
              <p className="text-orange-600 text-sm">¡Prepara unas lentejas espectaculares y comparte tu resultado!</p>
            </div>
          </div>

          {/* Búsquedas frecuentes */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Búsquedas Populares
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["Pastas", "Postres", "Favoritos", "Vegano", "Ensaladas"].map((term) => (
                <button 
                  key={term} 
                  onClick={() => {
                    setMainSearchQuery(term);
                    fetchRecipes(term);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm transition-colors duration-300"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Descubre Nuevas Recetas */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">{recipeListTitle}</h2>
            {isLoadingRecipes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 p-4 rounded-lg shadow animate-pulse">
                    <div className="w-full h-32 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : discoveredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoveredRecipes.map((recipe) => (
                  <Link href={`/details-recipe/${recipe.id}`} key={recipe.id} className="block group">
                    <div className="bg-white rounded-lg shadow-md p-4 group-hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-md sm:text-lg text-orange-700 truncate group-hover:text-orange-600">
                          {recipe.name || recipe.title || 'Nombre no disponible'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 capitalize">
                          {recipe.category || 'Tipo no especificado'}
                        </p>
                      </div>
                      <div className="mt-3 text-right">
                        <span className="text-xs text-orange-500 group-hover:underline">Ver receta →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 py-4 text-center">No se encontraron nuevas recetas por el momento.</p>
            )}
          </div>

          {/* Descripción de la página */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Sobre esta Página</h2>
            <p className="text-sm sm:text-base text-gray-700">
              {fixedPageDescription}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(HomePage);