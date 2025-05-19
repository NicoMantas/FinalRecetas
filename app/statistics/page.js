"use client"; /*se debe usar use client para que el componente se renderice en el cliente*/
import { useState, useEffect } from 'react'; // Añadir useState y useEffect
import withAuth from "../components/withAuth"; // Importar el HOC
import CollapsibleSidebarLayout from '../components/CollapsibleSidebarLayout'; // Added import
import { auth, db } from '../../firebase/firebase'; // Importar auth y db
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getInventoryItems } from '../../firebase/inventoryService'; // Para el conteo de ingredientes
import Link from 'next/link'; // Importar Link para los enlaces a recetas

// Iconos (actualizados para consistencia y mejora visual)
const RecipeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a8.485 8.485 0 0011.921 0M12 17.747a8.485 8.485 0 01-11.921 0M12 6.253a8.485 8.485 0 010 11.494m-4.243-5.747a5.25 5.25 0 1010.5 0 5.25 5.25 0 00-10.5 0z" /></svg>;
const FavoriteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const IngredientIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 11.428a8.25 8.25 0 00-14.856 0M12 19.5V21M12 3v1.5M4.5 12H3m18 0h-1.5m-15-3.75l-1.06-1.06M21.06 7.94l-1.06 1.06M4.5 15.75l-1.06 1.06M21.06 16.06l-1.06-1.06M12 7.5A4.5 4.5 0 007.5 12a4.5 4.5 0 004.5 4.5 4.5 4.5 0 004.5-4.5A4.5 4.5 0 0012 7.5z" /></svg>;
const LoginIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;

function StatisticsPage() {
  const [statsData, setStatsData] = useState({
    userName: '',
    recipesCreated: 0,
    recipesFavorited: 0,
    totalInventoryItems: 0,
    loginCount: 0,
    favoriteRecipesList: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeFavorites = () => {};

    const fetchStaticStats = async (currentUser) => {
      setIsLoading(true);
      setError(null);

      if (!currentUser) {
        setError("Usuario no autenticado. Por favor, inicia sesión.");
        setIsLoading(false);
        return;
      }

      try {
        let userName = currentUser.displayName || "Usuario";
        let userLoginCount = 0;

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          userName = userData.displayName || currentUser.displayName || "Usuario";
          userLoginCount = userData.loginCount || 0;
        }

        const recipesCreatedQuery = query(collection(db, "recipes"));
        const recipesCreatedSnap = await getDocs(recipesCreatedQuery);
        const numRecipesCreated = recipesCreatedSnap.size;

        const inventoryItems = await getInventoryItems();
        const numTotalInventoryItems = inventoryItems.length;

        if (isMounted) {
          setStatsData(prevData => ({
            ...prevData,
            userName: userName,
            recipesCreated: numRecipesCreated,
            totalInventoryItems: numTotalInventoryItems,
            loginCount: userLoginCount,
          }));
        }
      } catch (err) {
        console.error("Error fetching static stats:", err);
        if (isMounted) setError(prevError => prevError || "Error al cargar datos del usuario o inventario.");
      }
    };

    const handleAuthChange = (currentUser) => {
      if (currentUser) {
        fetchStaticStats(currentUser);

        const favoritesColRef = collection(db, "users", currentUser.uid, "favorites");
        unsubscribeFavorites = onSnapshot(favoritesColRef, async (snapshot) => {
          const favoriteRecipeIds = snapshot.docs.map(doc => doc.id);
          if (isMounted) {
            setStatsData(prevData => ({ ...prevData, recipesFavorited: favoriteRecipeIds.length }));
          }

          if (favoriteRecipeIds.length > 0) {
            const recipePromises = favoriteRecipeIds.map(id => getDoc(doc(db, "recipes", id)));
            const recipeDocs = await Promise.all(recipePromises);
            const favoriteRecipesDetails = recipeDocs
              .filter(docSnap => docSnap.exists())
              .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
            
            if (isMounted) {
              setStatsData(prevData => ({ ...prevData, favoriteRecipesList: favoriteRecipesDetails }));
            }
          } else {
            if (isMounted) {
              setStatsData(prevData => ({ ...prevData, favoriteRecipesList: [] }));
            }
          }
          if (isMounted) setIsLoading(false);
        }, (err) => {
          console.error("Error listening to favorites:", err);
          if (isMounted) setError(prevError => prevError || "Error al cargar recetas favoritas.");
          if (isMounted) setIsLoading(false);
        });
      } else {
        if (isMounted) {
          setError("Usuario no autenticado. Por favor, inicia sesión.");
          setIsLoading(false);
          setStatsData({ userName: '', recipesCreated: 0, recipesFavorited: 0, totalInventoryItems: 0, loginCount: 0, favoriteRecipesList: [] });
        }
      }
    };

    const unsubscribeAuth = auth.onAuthStateChanged(handleAuthChange);

    return () => {
      isMounted = false;
      unsubscribeAuth();
      unsubscribeFavorites();
    };
  }, []);

  if (isLoading) {
    return (
      <CollapsibleSidebarLayout>
        <div className="p-6 md:p-10 flex flex-col justify-center items-center min-h-[calc(100vh-120px)]">
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          <p className="text-xl text-orange-600 mt-6 font-semibold">Cargando tus estadísticas...</p>
        </div>
      </CollapsibleSidebarLayout>
    );
  }

  if (error && !statsData.userName) {
    return (
      <CollapsibleSidebarLayout>
        <div className="p-6 md:p-10 flex flex-col justify-center items-center min-h-[calc(100vh-120px)] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-2xl font-semibold text-red-600 mb-2">¡Ups! Algo salió mal</p>
          <p className="text-gray-600">{error}</p>
          <p className="text-gray-500 mt-3 text-sm">Intenta recargar la página o verifica tu conexión.</p>
        </div>
      </CollapsibleSidebarLayout>
    );
  }

  return (
    <CollapsibleSidebarLayout>
      <div className="p-6 md:p-10 bg-orange-50 min-h-screen">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-700 tracking-tight">Estadísticas de {statsData.userName || 'Usuario'}</h1>
          <p className="text-lg text-orange-600 mt-2 max-w-2xl mx-auto">Aquí tienes un resumen de tu actividad en ReinventandoCocina y algunas métricas globales.</p>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          <StatCard title="Recetas Creadas" value={statsData.recipesCreated} icon={<RecipeIcon />} />
          <StatCard title="Recetas Favoritas" value={statsData.recipesFavorited} icon={<FavoriteIcon />} />
          <StatCard title="Ingredientes Globales" value={statsData.totalInventoryItems} icon={<IngredientIcon />} details="(En toda la plataforma)" />
          <StatCard title="Visitas a la App" value={statsData.loginCount} icon={<LoginIcon />} />
        </div>
        
        <div className="mt-12 p-6 md:p-8 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-orange-700 mb-6 text-center md:text-left">Mis Recetas Favoritas</h2>
          {statsData.favoriteRecipesList.length > 0 ? (
            <ul className="space-y-4">
              {statsData.favoriteRecipesList.map(recipe => (
                <li key={recipe.id} className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
                  <Link href={`/details-recipe/${recipe.id}`} className="group block">
                    <h3 className="text-lg font-semibold text-orange-600 group-hover:text-orange-700 group-hover:underline">
                      {recipe.title || "Receta sin título"}
                    </h3>
                    {recipe.category && <p className="text-sm text-gray-500 mt-1">Categoría: {recipe.category}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center md:text-left py-4">Aún no has añadido ninguna receta a tus favoritos. ¡Explora y guarda las que más te gusten!</p>
          )}
        </div>
        
        <div className="mt-16 p-8 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl shadow-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">¡Más Estadísticas en Camino!</h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto">
                Estamos cocinando nuevas visualizaciones y datos para que descubras aún más sobre tus hábitos culinarios y el pulso de nuestra comunidad. ¡Mantente al tanto!
            </p>
        </div>

      </div>
    </CollapsibleSidebarLayout>
  );
}

// Componente StatCard Mejorado
const StatCard = ({ title, value, icon, details }) => (
  <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-start min-h-[180px]">
    <div className="mb-4">{icon}</div>
    <h2 className="text-5xl font-extrabold text-orange-600 mb-1">{value}</h2>
    <p className="text-gray-700 text-lg font-semibold text-center">{title}</p>
    {details && <p className="text-xs text-gray-500 mt-2 text-center">{details}</p>}
  </div>
);

export default withAuth(StatisticsPage); // Exportar componente envuelto
