'use client';

import { useState } from 'react';

const createRecipe = async (recipeData) => {
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
      alert("Receta creada con éxito!");
      return result;
    } else {
      alert("Error: " + result.error);
      return null;
    }
  } catch (error) {
    alert("Error al crear receta: " + error.message);
    return null;
  }
};

export default function CreateRecipePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [category, setCategory] = useState('Plato Principal');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState([{ id: Date.now(), text: '', mediaUrl: null }]);
  const [error, setError] = useState('');

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), text: '', mediaUrl: null }]);
  };

  const handleCreateRecipe = async () => {
    // Validación simple
    if (!title || !description || !createdBy || ingredients.some(i => i.trim() === '') || steps.some(s => s.text.trim() === '')) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setError('');

    const recipeData = {
      title,
      description,
      createdBy,
      category,
      ingredients: ingredients.filter(i => i.trim() !== '').map(name => ({ name })),
      steps: steps.map(({ text, mediaUrl }) => ({ text, mediaUrl })),
    };

    await createRecipe(recipeData);
  };

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-orange-600">Create a New Recipe</h1>

        {/* Error message */}
        {error && <div className="text-red-600">{error}</div>}

        {/* Clasificación */}
        <div>
          <label className="block font-semibold mb-1">Classification:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option>Plato Principal</option>
            <option>Dessert</option>
            <option>Drink</option>
            <option>Snack</option>
          </select>
        </div>

        {/* Nombre del autor */}
        <div>
          <label className="block font-semibold mb-1">Created by:</label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />
        </div>

        {/* Nombre de la receta */}
        <div>
          <label className="block font-semibold mb-1">Recipe Name:</label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block font-semibold mb-1">Short Description:</label>
          <textarea
            className="w-full border rounded-lg px-4 py-2"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Ingredientes */}
        <div>
          <label className="block font-semibold mb-2">Ingredients:</label>
          {ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              className="w-full border rounded-lg px-4 py-2 mb-2"
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index] = e.target.value;
                setIngredients(newIngredients);
              }}
            />
          ))}
          <button onClick={addIngredient} className="text-sm text-blue-600 hover:underline">
            + Add Ingredient
          </button>
        </div>

        {/* Pasos */}
        <div>
          <label className="block font-semibold mb-2">Steps:</label>
          {steps.map((step, index) => (
            <div key={step.id} className="space-y-2 mb-4">
              <textarea
                className="w-full border rounded-lg px-4 py-2"
                rows="2"
                placeholder={`Step ${index + 1}`}
                value={step.text}
                onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[index].text = e.target.value;
                  setSteps(newSteps);
                }}
              />
            </div>
          ))}
          <button onClick={addStep} className="text-sm text-blue-600 hover:underline">
            + Add Step
          </button>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={handleCreateRecipe}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Create Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
