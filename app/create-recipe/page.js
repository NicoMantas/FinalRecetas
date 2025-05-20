'use client';

import { useState, useEffect } from 'react';
import withAuth from "../components/withAuth";
import CollapsibleSidebarLayout from '../components/CollapsibleSidebarLayout';
import { auth } from '../../firebase/firebase';
import toast, { Toaster } from 'react-hot-toast';

const createRecipeInApi = async (recipeData) => {
  try {
    const response = await fetch("/api/firestore/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    const result = await response.json();
    if (response.ok) {
      toast.success("Receta creada con éxito!");
      return result;
    } else {
      toast.error("Error al crear receta: " + (result.error || "Error desconocido"));
      return null;
    }
  } catch (error) {
    toast.error("Error al crear receta: " + error.message);
    return null;
  }
};

function CreateRecipePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [category, setCategory] = useState('Plato Principal');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState([{ id: Date.now(), text: '', mediaUrl: null }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUserUid(user.uid);
      } else {
        setCurrentUserUid(null);
        toast.error("Debes iniciar sesión para crear una receta.");
      }
    });
    return () => unsubscribe();
  }, []);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), text: '', mediaUrl: null }]);
  };

  const removeStep = (idToRemove) => {
    setSteps(steps.filter(step => step.id !== idToRemove));
  };

  const handleCreateRecipe = async () => {
    if (!currentUserUid) {
      toast.error('Debes iniciar sesión para crear una receta. Por favor, recarga la página si ya iniciaste sesión.');
      return;
    }
    if (!title || !description || ingredients.some(i => i.trim() === '') || steps.some(s => s.text.trim() === '')) {
      toast.error('Por favor, complete todos los campos obligatorios (Nombre, Descripción, Ingredientes y Pasos).');
      return;
    }

    setIsLoading(true);

    const recipeData = {
      title,
      description,
      createdBy: currentUserUid,
      category,
      ingredients: ingredients.filter(i => i.trim() !== '').map(name => ({ name })),
      steps: steps.filter(s => s.text.trim() !== '').map(({ text, mediaUrl }) => ({ text, mediaUrl })),
    };

    const result = await createRecipeInApi(recipeData);
    if (result) {
      setTitle('');
      setDescription('');
      setCategory('Plato Principal');
      setIngredients(['']);
      setSteps([{ id: Date.now(), text: '', mediaUrl: null }]);
    }
    setIsLoading(false);
  };

  return (
    <CollapsibleSidebarLayout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-8">Crear Nueva Receta</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleCreateRecipe(); }} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold mb-1" style={{ color: "black" }}>Categoría:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                <optgroup label="Tipo de comida" style={{ color: "black" }}>
                  <option>Plato Principal</option>
                  <option>Aperitivo</option>
                  <option>Postre</option>
                  <option>Bebida</option>
                </optgroup>
                <optgroup label="Momento del día" style={{ color: "black" }}>
                  <option>Desayuno</option>
                  <option>Almuerzo</option>
                  <option>Cena</option>
                  <option>Snack</option>
                </optgroup>
                <optgroup label="Estilo / Dieta" style={{ color: "black" }}>
                  <option>Vegetariano</option>
                  <option>Vegano</option>
                  <option>Sin Gluten</option>
                  <option>Light / Baja en calorías</option>
                </optgroup>
                <optgroup label="Cocinas del mundo" style={{ color: "black" }}>
                  <option>Mexicana</option>
                  <option>Italiana</option>
                  <option>Japonesa</option>
                  <option>India</option>
                  <option>Mediterránea</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="recipeName" className="block text-sm font-semibold mb-1" style={{ color: "black" }}>Nombre de la Receta:</label>
              <input
                id="recipeName"
                type="text"
                placeholder="Ej: Tarta de Manzana Clásica"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-1" style={{ color: "black" }}>Descripción Corta:</label>
              <textarea
                id="description"
                placeholder="Una breve descripción de tu receta..."
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1" style={{ color: "black" }}>Ingredientes:</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <input
                    type="text"
                    className="flex-grow mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                    placeholder={`Ingrediente ${index + 1}`}
                    value={ingredient}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index] = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    required
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm shadow-md"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addIngredient} 
                className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline mt-2 py-2 px-3 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
              >
                + Añadir Ingrediente
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1" style={{ color: "black" }}>Pasos:</label>
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3 mb-2">
                  <textarea
                    className="flex-grow mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                    rows="3"
                    placeholder={`Paso ${index + 1}`}
                    value={step.text}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[index].text = e.target.value;
                      setSteps(newSteps);
                    }}
                    required
                  />
                  {steps.length > 1 && (
                     <button 
                       type="button"
                       onClick={() => removeStep(step.id)}
                       className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm shadow-md flex-shrink-0 mt-1"
                     >
                       Eliminar
                     </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addStep} 
                className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline mt-2 py-2 px-3 border border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
              >
                + Añadir Paso
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading || !currentUserUid}
                className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                  (isLoading || !currentUserUid) ? "bg-orange-300 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creando Receta..." : "Crear Receta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CollapsibleSidebarLayout>
  );
}

export default withAuth(CreateRecipePage);
