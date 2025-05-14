"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import withAuth from "../components/withAuth";

function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        await fetchFavoriteRecipesDetails(user.uid);
      } else {
        setCurrentUser(null);
        setFavoriteRecipes([]); // Clear recipes if user logs out
        router.push("/log-in"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchFavoriteRecipesDetails = async (userId) => {
    if (!userId) return;
    try {
      const favoritesCollectionRef = collection(db, "users", userId, "favorites");
      const favoritesSnapshot = await getDocs(favoritesCollectionRef);
      const favoriteRecipeIds = favoritesSnapshot.docs.map(doc => doc.id);

      if (favoriteRecipeIds.length === 0) {
        setFavoriteRecipes([]);
        return;
      }

      const recipesDetails = [];
      for (const recipeId of favoriteRecipeIds) {
        const recipeDocRef = doc(db, "recipes", recipeId);
        const recipeDocSnap = await getDoc(recipeDocRef);
        if (recipeDocSnap.exists()) {
          recipesDetails.push({ id: recipeDocSnap.id, ...recipeDocSnap.data() });
        } else {
          console.warn(`Favorite recipe with ID ${recipeId} not found in main recipes collection.`);
          // Optionally, remove this now-orphaned favorite
          // await deleteDoc(doc(db, "users", userId, "favorites", recipeId));
        }
      }
      setFavoriteRecipes(recipesDetails);
    } catch (error) {
      console.error("Error fetching favorite recipes details: ", error);
    }
  };
  
  const handleRemoveFavorite = async (recipeId) => {
    if (!currentUser) return;
    const userId = currentUser.uid;
    const favDocRef = doc(db, "users", userId, "favorites", recipeId);
    try {
      await deleteDoc(favDocRef);
      setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Error al quitar de favoritos.");
    }
  };


  // Styles (similar to ListRecipesPage for consistency)
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #e0f7fa, #b2ebf2)", // Teal gradient
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
  };

  const headerContainerStyle = {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const mainTitleStyle = {
    fontSize: "2.8rem",
    fontWeight: "bold",
    color: "#004d40", // Darker teal
    textAlign: 'center',
  };

  const profileButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#00796b', // Medium teal
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  };
  
  const listContainerStyle = {
    background: "#ffffff",
    borderRadius: "20px", 
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)", 
    padding: "30px",
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "25px", 
  };

  const recipeCardStyle = {
    background: "#fafffe",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const recipeTitleStyle = {
    margin: 0,
    fontSize: "1.5rem", 
    fontWeight: "bold", 
    color: "#00695c",
  };

  const recipeDescriptionStyle = {
    margin: "0 0 15px 0", 
    color: "#37474f",
    fontSize: '1rem',
    lineHeight: '1.6',
  };

  const actionsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  };

  const detailsButtonStyle = {
    background: "#26a69a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  };

  const removeFavoriteButtonStyle = {
    background: "#ef5350", // A reddish color for removal
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "500",
    transition: 'background-color 0.2s ease',
  };


  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={mainTitleStyle}>
          Mis Recetas Favoritas
        </h1>
        <Link href="/profile" passHref legacyBehavior>
          <button 
            style={profileButtonStyle} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor='#00695c'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor='#00796b'}
          >
            Volver al Perfil
          </button>
        </Link>
      </div>
      {loading ? (
        <p style={{ color: "#004d40", fontSize: "1.5rem", textAlign: 'center' }}>Cargando tus favoritas...</p>
      ) : favoriteRecipes.length === 0 ? (
        <div style={listContainerStyle}> 
          <p style={{ color: "#546e7a", fontSize: "1.2rem", textAlign: 'center' }}>
            No tienes recetas guardadas en favoritos todavía.
          </p>
        </div>
      ) : (
        <div style={listContainerStyle}>
          {favoriteRecipes.map((recipe) => (
            <div key={recipe.id} style={recipeCardStyle}>
              <h2 style={recipeTitleStyle}>{recipe.title}</h2>
              <p style={recipeDescriptionStyle}>{recipe.description}</p>
              <div style={actionsContainerStyle}>
                <Link
                  href={`/details-recipe/${recipe.id}?from=favorites`}
                  passHref
                  legacyBehavior>
                  <button 
                    style={detailsButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor='#00897b'} 
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor='#26a69a'}
                  >
                    Ver detalles
                  </button>
                </Link>
                <button 
                  onClick={() => handleRemoveFavorite(recipe.id)}
                  style={removeFavoriteButtonStyle}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor='#d32f2f'} 
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor='#ef5350'}
                  title="Quitar de favoritos"
                >
                  Quitar Favorito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(FavoritesPage); 