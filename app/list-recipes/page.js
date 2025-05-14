"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Assuming firebase.js is in a firebase folder at the root
import Link from "next/link";
import withAuth from "../components/withAuth";

function ListRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, "recipes");
        const recipeSnapshot = await getDocs(recipesCollection);
        const recipesList = recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecipes(recipesList);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

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

  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={mainTitleStyle}>
          Tus Recetas
        </h1>
        <Link href="/profile" passHref>
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
              <Link href={`/details-recipe/${recipe.id}`} passHref>
                <button 
                  style={detailsButtonStyle} 
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor='#00897b'} 
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor='#26a69a'}
                >
                  Ver detalles
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(ListRecipesPage);
