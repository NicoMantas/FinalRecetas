"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.js'; // Adjust path based on your firebase.js location
import { useParams, useRouter } from 'next/navigation'; // To get route params and useRouter
import Link from 'next/link'; // Added Link

function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter(); // For navigation
  const { id } = params; // Get the recipe ID from the URL

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        setLoading(true);
        setError(null);
        try {
          const recipeRef = doc(db, 'recipes', id);
          const recipeSnap = await getDoc(recipeRef);

          if (recipeSnap.exists()) {
            setRecipe({ id: recipeSnap.id, ...recipeSnap.data() });
          } else {
            setError('Receta no encontrada.');
            console.log('No such document!');
          }
        } catch (err) {
          console.error("Error fetching recipe: ", err);
          setError('Error al cargar la receta.');
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [id]); // Re-run effect if ID changes

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer.")) {
      try {
        await deleteDoc(doc(db, 'recipes', id));
        alert("Receta eliminada exitosamente.");
        router.push('/list-recipes'); // Redirect to recipe list or profile
      } catch (error) {
        console.error("Error deleting recipe: ", error);
        alert("Error al eliminar la receta.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontSize: '1.5rem', color: '#555' }}>
        Cargando detalles de la receta...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontSize: '1.5rem', color: 'red' }}>
        {error}
      </div>
    );
  }

  if (!recipe) {
    // This case should ideally be covered by the error state if not found
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontSize: '1.5rem', color: '#555' }}>
        Receta no encontrada.
      </div>
    );
  }

  // Basic styling, you can expand this
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #e0f7fa, #b2ebf2)", // Light teal gradient
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 6px 30px rgba(0,0,0,0.1)", // Softer shadow
    padding: "32px",
    width: "700px", // Slightly wider
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const titleStyle = {
    fontSize: "2.5rem", // Larger title
    fontWeight: "bold",
    color: "#004d40", // Darker teal for title
    marginBottom: "5px", // Reduced margin
    textAlign: 'center',
  };

  const metaInfoStyle = {
    textAlign: 'center',
    color: '#00796b', // Medium teal
    fontSize: '0.95rem',
    marginBottom: '20px',
  };

  const categoryStyle = {
    fontWeight: '500',
    fontStyle: 'italic',
  };

  const createdByStyle = {
    marginLeft: '10px',
  };

  const descriptionStyle = {
    fontSize: "1.1rem",
    color: "#444",
    lineHeight: "1.6",
  };

  const detailItemStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#004d40', // Darker teal for labels
    display: 'block',
    marginBottom: '5px',
    fontSize: '1.1rem',
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '30px',
    flexWrap: 'wrap',
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#00796b', // Medium teal
    color: 'white',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4db6ac', // Lighter teal
    color: 'white',
  };
  
  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e57373', // Soft red for delete
    color: 'white',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{recipe.title}</h1>

        <div style={metaInfoStyle}>
          {recipe.category && <span style={categoryStyle}>Categoría: {recipe.category}</span>}
          {recipe.createdBy && <span style={createdByStyle}>Creado por: {recipe.createdBy}</span>}
        </div>

        {recipe.description && (
          <div style={detailItemStyle}>
            <span style={labelStyle}>Descripción:</span>
            <p style={descriptionStyle}>{recipe.description}</p>
          </div>
        )}

        {/* Example for ingredients - assuming it's an array of strings */}
        {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
          <div style={detailItemStyle}>
            <span style={labelStyle}>Ingredientes:</span>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {recipe.ingredients.map((ing, index) => (
                <li key={index} style={{ color: '#555', marginBottom: '5px' }}>{ing.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Updated section for steps (formerly instructions) */}
        {recipe.steps && Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
          <div style={detailItemStyle}>
            <span style={labelStyle}>Pasos:</span>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              {recipe.steps.map((step, index) => (
                <li key={index} style={{ color: '#555', marginBottom: '8px' }}>
                  {step.text} {/* Display the text property of each step object */}
                  {/* We can add logic here later to display step.mediaUrl if present */}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div style={buttonGroupStyle}>
          <Link href="/profile" passHref>
            <button style={primaryButtonStyle}>Volver al perfil</button>
          </Link>
          <Link href={`/edit-recipe/${id}`} passHref>
            <button style={secondaryButtonStyle}>Actualizar Receta</button>
          </Link>
          <button onClick={handleDelete} style={dangerButtonStyle}>Eliminar Receta</button>
        </div>

      </div>
    </div>
  );
}

export default RecipeDetailPage; 