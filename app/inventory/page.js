'use client';

import { useState } from 'react';

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Tomato', quantity: '5', image: '/images/tomato.png' },
    { id: 2, name: 'Cheese', quantity: '2 blocks', image: '/images/cheese.png' },
    { id: 3, name: 'Lettuce', quantity: '1 head', image: '/images/lettuce.png' },
  ]);

  const handleDelete = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const handleCreate = () => {
    const name = prompt('Ingredient name:');
    const quantity = prompt('Quantity:');
    const image = prompt('Image URL (or leave empty for placeholder):');
    if (name && quantity) {
      setIngredients([
        ...ingredients,
        {
          id: Date.now(),
          name,
          quantity,
          image: image || '/images/placeholder.png',
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Inventory</h1>
          <div className="flex gap-4">
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create
            </button>
            <button
              onClick={() => window.location.href = '/home'}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Lista de ingredientes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ingredients.map((item) => (
            <div
              key={item.id}
              className="bg-orange-50 rounded-lg shadow p-4 flex flex-col items-center text-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-full mb-4 border"
              />
              <div className="font-bold text-lg">{item.name}</div>
              <div className="text-gray-600 mb-4">Qty: {item.quantity}</div>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
