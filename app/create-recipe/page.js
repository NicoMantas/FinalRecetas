'use client';

import { useState } from 'react';

export default function CreateRecipePage() {
  const [steps, setSteps] = useState([{ id: 1, text: '', media: null }]);
  const [ingredients, setIngredients] = useState(['']);

  const addStep = () => {
    setSteps([...steps, { id: steps.length + 1, text: '', media: null }]);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-orange-600">Create a New Recipe</h1>

        {/* Foto de la receta */}
        <div>
          <label className="block font-semibold mb-1">Recipe Photo:</label>
          <input type="file" accept="image/*" className="w-full" />
        </div>

        {/* Clasificación */}
        <div>
          <label className="block font-semibold mb-1">Classification:</label>
          <select className="w-full border rounded-lg px-4 py-2">
            <option>Main Dish</option>
            <option>Dessert</option>
            <option>Drink</option>
            <option>Snack</option>
          </select>
        </div>

        {/* Nombre del autor */}
        <div>
          <label className="block font-semibold mb-1">Created by:</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="Your name" />
        </div>

        {/* Nombre de la receta */}
        <div>
          <label className="block font-semibold mb-1">Recipe Name:</label>
          <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="E.g. Chocolate Cake" />
        </div>

        {/* Descripción */}
        <div>
          <label className="block font-semibold mb-1">Short Description:</label>
          <textarea className="w-full border rounded-lg px-4 py-2" rows="3" placeholder="Brief description..."></textarea>
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
            />
          ))}
          <button onClick={addIngredient} className="text-sm text-blue-600 hover:underline">
            + Add Ingredient
          </button>
        </div>

        {/* Pasos con foto o video */}
        <div>
          <label className="block font-semibold mb-2">Steps:</label>
          {steps.map((step, index) => (
            <div key={step.id} className="space-y-2 mb-4">
              <textarea
                className="w-full border rounded-lg px-4 py-2"
                rows="2"
                placeholder={`Step ${index + 1}`}
              />
              <input type="file" accept="image/*,video/*" />
            </div>
          ))}
          <button onClick={addStep} className="text-sm text-blue-600 hover:underline">
            + Add Step
          </button>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            Save as Draft
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Create Recipe
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
