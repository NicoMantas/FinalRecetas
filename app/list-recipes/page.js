"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase"; // Assuming firebase.js is in a firebase folder at the root
import Link from "next/link";
import withAuth from "../components/withAuth";

function ListRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  // Ejemplo de recetas (esto se reemplazará por datos reales más adelante)
  // const recipes = [
  //   {
  //     id: 1,
  //     title: "Ejemplo 1",
  //     description: "test de la page en este partado debría ir la receta",
  //   },
  //   {
  //     id: 2,
  //     title: "Ensalada César",
  //     description: "Clásica ensalada con pollo, lechuga y aderezo especial.",
  //   },
  //   {
  //     id: 3,
  //     title: "😋😋😊😊",
  //     description: "creo que acá se listria luego con un array las recetas",
  //   },
  // ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        await fetchRecipes(); // Fetch all recipes
        await fetchFavorites(user.uid); // Then fetch user's favorites
      } else {
        setCurrentUser(null);
        setRecipes([]); // Clear recipes if user logs out
        setFavorites(new Set()); // Clear favorites
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchRecipes = async () => {
    // setLoading(true); // setLoading is handled in onAuthStateChanged
    try {
      const recipesCollection = collection(db, "recipes");
      const recipeSnapshot = await getDocs(recipesCollection);
      const recipesList = recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesList);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    }
  };

  const fetchFavorites = async (userId) => {
    if (!userId) return;
    try {
      const favoritesCollection = collection(db, "users", userId, "favorites");
      const favoritesSnapshot = await getDocs(favoritesCollection);
      const favoriteIds = new Set(favoritesSnapshot.docs.map(doc => doc.id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
      // Potentially set an error state here to inform the user
    }
  };

  const toggleFavorite = async (recipeId) => {
    if (!currentUser) {
      console.error("No user logged in");
      // Optionally, redirect to login or show a message
      return;
    }
    const userId = currentUser.uid;
    const favDocRef = doc(db, "users", userId, "favorites", recipeId);
    
    try {
      if (favorites.has(recipeId)) {
        // Remove from favorites
        await deleteDoc(favDocRef);
        setFavorites(prevFavorites => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.delete(recipeId);
          return newFavorites;
        });
      } else {
        // Add to favorites
        // Storing a simple marker or timestamp. Could also store recipe title/summary for optimization.
        await setDoc(favDocRef, { favoritedAt: new Date() });
        setFavorites(prevFavorites => new Set(prevFavorites).add(recipeId));
      }
    } catch (error) {
      console.error("Error toggling favorite: ", error);
      // Display error to user
    }
  };

  // Styles
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #e0f7fa, #b2ebf2)", // Teal gradient
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px", // Space between title/button and recipe list container
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
    alignItems: "stretch", // Changed from center to stretch for full-width cards
    gap: "25px", 
  };

  const recipeCardStyle = {
    background: "#fafffe", // Very light, almost white background for cards
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
    color: "#00695c", // Medium dark teal
  };

  const recipeDescriptionStyle = {
    margin: "0 0 15px 0", 
    color: "#37474f", // Dark grey-blue for text
    fontSize: '1rem',
    lineHeight: '1.6',
  };

  const detailsButtonStyle = {
    background: "#26a69a", // Brighter teal for button
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "500",
    alignSelf: 'flex-start', // Button to the left
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  };

  const recipeActionsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px', // Add some space above the actions
  };

  const favoriteButtonStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    fontSize: "1.5rem", // Adjust size as needed
    color: "#fbc02d", // Yellow star color
  };

  const favoritedButtonStyle = {
    ...favoriteButtonStyle,
    color: "#f57f17", // Darker yellow for favorited
  };

  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={mainTitleStyle}>
          Tus Recetas
        </h1>
        <Link href="/profile" passHref legacyBehavior>
          <button style={profileButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor='#00695c'} onMouseOut={(e) => e.currentTarget.style.backgroundColor='#00796b'}>
            Volver al Perfil
          </button>
        </Link>
      </div>
      {loading ? (
        <p style={{ color: "#004d40", fontSize: "1.5rem", textAlign: 'center' }}>Cargando recetas...</p>
      ) : recipes.length === 0 ? (
        <div style={listContainerStyle}> 
          <p style={{ color: "#546e7a", fontSize: "1.2rem", textAlign: 'center' }}>
            No tienes recetas guardadas todavía.
          </p>
        </div>
      ) : (
        <div style={listContainerStyle}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={recipeCardStyle}>
              <h2 style={recipeTitleStyle}>
                {recipe.title}
              </h2>
              <p style={recipeDescriptionStyle}>
                {recipe.description}
              </p>
              <div style={recipeActionsStyle}>
                <Link href={`/details-recipe/${recipe.id}`} passHref legacyBehavior>
                  <button 
                    style={detailsButtonStyle} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor='#00897b'} 
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor='#26a69a'}
                  >
                    Ver detalles
                  </button>
                </Link>
                <button 
                  onClick={() => toggleFavorite(recipe.id)} 
                  style={favorites.has(recipe.id) ? favoritedButtonStyle : favoriteButtonStyle}
                  title={favorites.has(recipe.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  {favorites.has(recipe.id) ? '★' : '☆'} 
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(ListRecipesPage);
