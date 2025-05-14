'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.js'; // Adjust path if necessary
import { useParams, useRouter } from 'next/navigation';
import withAuth from "../../components/withAuth"; // Adjust path if necessary

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
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

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
            setError('Receta no encontrada.');
          }
        } catch (err) {
          console.error("Error fetching recipe data: ", err);
          setError('Error al cargar los datos de la receta.');
        } finally {
          setLoading(false);
        }
      };
      fetchRecipeData();
    }
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
    setFormError('');
    if (!title || !description || !createdBy || ingredients.some(i => i.name.trim() === '') || steps.some(s => s.text.trim() === '')) {
      setFormError('Por favor, complete todos los campos requeridos.');
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

    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, recipeData);
      alert("Receta actualizada con éxito!");
      router.push(`/details-recipe/${recipeId}`); // Navigate back to details page
    } catch (err) {
      console.error("Error updating recipe: ", err);
      setFormError("Error al actualizar la receta: " + err.message);
      alert("Error al actualizar la receta: " + err.message);
    }
  };

  if (loading) return <div className="text-center p-10">Cargando datos de la receta...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-orange-600">Editar Receta</h1>

        {formError && <div className="text-red-600 bg-red-100 p-3 rounded-md">{formError}</div>}

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
      </div>
    </div>
  );
}

export default withAuth(EditRecipePage); 