'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.js'; // Adjust path if necessary
import { useParams, useRouter } from 'next/navigation';
import withAuth from "../../components/withAuth"; // Adjust path if necessary
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const { id: recipeId } = params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [category, setCategory] = useState('Plato Principal');
  const [ingredients, setIngredients] = useState([{ name: '' }]); // Match create-recipe: array of objects
  const [steps, setSteps] = useState([{ id: Date.now(), text: '', mediaUrl: null }]);
  
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(''); // Replaced by toast for initial load error
  // const [formError, setFormError] = useState(''); // Replaced by toast for form validation

  useEffect(() => {
    if (recipeId) {
      const fetchRecipeData = async () => {
        setLoading(true);
        try {
          const recipeRef = doc(db, 'recipes', recipeId);
          const recipeSnap = await getDoc(recipeRef);
          if (recipeSnap.exists()) {
            const data = recipeSnap.data();
            setTitle(data.title || '');
            setDescription(data.description || '');
            setCreatedBy(data.createdBy || '');
            setCategory(data.category || 'Plato Principal');
            // Ingredients in create-recipe are stored as [{name: '... '}] but fetched as strings. Adapt.
            setIngredients(data.ingredients && data.ingredients.length > 0 ? data.ingredients.map(ing => (typeof ing === 'string' ? { name: ing } : ing)) : [{ name: '' }]);
            setSteps(data.steps && data.steps.length > 0 ? data.steps.map(step => ({ ...step, id: step.id || Date.now() })) : [{ id: Date.now(), text: '', mediaUrl: null }]);
          } else {
            // setError('Receta no encontrada.');
            toast.error('Receta no encontrada. Redirigiendo...');
            router.push("/home"); // Or to a 404 page
          }
        } catch (err) {
          console.error("Error fetching recipe data: ", err);
          // setError('Error al cargar los datos de la receta.');
          toast.error('Error al cargar los datos de la receta: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipeData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { name: value }; // Ensure object structure
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '' }]);
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].text = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), text: '', mediaUrl: null }]);
  };

  const removeStep = (idToRemove) => {
    setSteps(steps.filter(step => step.id !== idToRemove));
  };

  const handleUpdateRecipe = async () => {
    // setFormError(''); // No longer needed
    if (!title || !description || !createdBy || ingredients.some(i => i.name.trim() === '') || steps.some(s => s.text.trim() === '')) {
      // setFormError('Por favor, complete todos los campos requeridos.');
      toast.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    const recipeData = {
      title,
      description,
      createdBy,
      category,
      ingredients: ingredients.filter(i => i.name.trim() !== ''), // Already objects {name: ...}
      steps: steps.map(({ text, mediaUrl }) => ({ text, mediaUrl })), // Remove client-side id if not needed for DB
      updatedAt: new Date(), // Optional: add an update timestamp
    };

    const toastId = toast.loading("Actualizando receta..."); // Loading toast
    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, recipeData);
      // alert("Receta actualizada con éxito!"); // Replaced
      toast.success("Receta actualizada con éxito!", { id: toastId });
      router.push(`/details-recipe/${recipeId}`); // Navigate back to details page
    } catch (err) {
      console.error("Error updating recipe: ", err);
      // setFormError("Error al actualizar la receta: " + err.message);
      // alert("Error al actualizar la receta: " + err.message); // Replaced
      toast.error("Error al actualizar la receta: " + err.message, { id: toastId });
    }
  };

  // if (loading) return <div className="text-center p-10">Cargando datos de la receta...</div>; // Handled by initial toast or component rendering
  // if (error) return <div className="text-center p-10 text-red-500">{error}</div>; // Errors shown via toast
  // Initial loading state can be handled differently, e.g. showing a spinner until data is fetched
  // or allowing the form to render with placeholders/disabled fields.
  // For simplicity, we'll let the form render and toasts handle errors.
  // If the initial fetch fails critically (recipe not found), we redirect.

  if (loading && !recipeId) { // Still show loading if recipeId isn't available yet (initial render)
    return <div className="text-center p-10">Cargando...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-orange-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-orange-600">Editar Receta</h1>

          {/* {formError && <div className="text-red-600 bg-red-100 p-3 rounded-md">{formError}</div>} */}

          {loading && recipeId ? (
             <div className="text-center p-10">Cargando datos de la receta...</div>
          ) : (
            <>
              <div>
                <label className="block font-semibold mb-1 text-black">Categoría:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-black/60"
                >
                  <option>Plato Principal</option>
                  <option>Dessert</option>
                  <option>Drink</option>
                  <option>Snack</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-black">Creado por:</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 text-black/60"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-black">Nombre de la Receta:</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 text-black/60"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-black">Descripción Corta:</label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2 text-black/60"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-black">Ingredientes:</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-grow border rounded-lg px-4 py-2 text-black/60"
                      placeholder={`Ingrediente ${index + 1}`}
                      value={ingredient.name} // Access .name property
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addIngredient} className="text-sm text-blue-600 hover:underline mt-2">
                  + Agregar Ingrediente
                </button>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-black">Pasos:</label>
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-2 mb-2">
                    <textarea
                      className="flex-grow border rounded-lg px-4 py-2 text-black/60"
                      rows="2"
                      placeholder={`Paso ${index + 1}`}
                      value={step.text}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                    />
                    {steps.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex-shrink-0"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addStep} className="text-sm text-blue-600 hover:underline mt-2">
                  + Agregar Paso
                </button>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push(`/details-recipe/${recipeId}`)} // Cancel button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateRecipe}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Actualizar Receta
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default withAuth(EditRecipePage); 