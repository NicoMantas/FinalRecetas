'use client';

import { useState } from 'react';
import withAuth from "../components/withAuth";
import CollapsibleSidebarLayout from '../components/CollapsibleSidebarLayout';

function InventoryPage() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Tomate', quantity: '5 unidades', image: '/images/tomato.png' },
    { id: 2, name: 'Queso Mozzarella', quantity: '2 bloques', image: '/images/cheese.png' },
    { id: 3, name: 'Lechuga Romana', quantity: '1 cabeza', image: '/images/lettuce.png' },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  const handleDelete = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const handleOpenCreateModal = () => {
    setNewItemName('');
    setNewItemQuantity('');
    setNewItemImage('');
    setShowCreateModal(true);
  };

  const handleCreateIngredient = (e) => {
    e.preventDefault();
    if (newItemName && newItemQuantity) {
      const newIngredient = {
        id: Date.now(),
        name: newItemName,
        quantity: newItemQuantity,
        image: newItemImage || '/images/placeholder.png',
      };
      setIngredients([...ingredients, newIngredient]);
      setShowCreateModal(false);
    } else {
      alert("Por favor, ingresa el nombre y la cantidad del ingrediente.");
    }
  };

  return (
    <CollapsibleSidebarLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-4 sm:mb-0">Inventario de Ingredientes</h1>
            <div className="flex gap-3">
              <button
                onClick={handleOpenCreateModal}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Añadir Ingrediente
              </button>
            </div>
          </div>

          {ingredients.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-lg">
              <img src="/images/empty-inventory.svg" alt="Inventario Vacío" className="mx-auto h-40 w-40 mb-6" />
              <h2 className="text-2xl font-semibold text-orange-600 mb-2">Tu inventario está vacío</h2>
              <p className="text-gray-600 mb-6">Empieza añadiendo ingredientes para llevar un control.</p>
              <button
                onClick={handleOpenCreateModal}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Añadir Mi Primer Ingrediente
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ingredients.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src='/images/placeholder-ingredient.png'; }}
                  />
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-orange-700 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">Cantidad: {item.quantity}</p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium shadow-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
              <h2 className="text-2xl font-bold text-orange-700 mb-6">Añadir Nuevo Ingrediente</h2>
              <form onSubmit={handleCreateIngredient} className="space-y-4">
                <div>
                  <label htmlFor="itemName" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Ingrediente:</label>
                  <input
                    id="itemName"
                    type="text"
                    required
                    placeholder="Ej: Harina de Trigo"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="itemQuantity" className="block text-sm font-semibold text-gray-700 mb-1">Cantidad:</label>
                  <input
                    id="itemQuantity"
                    type="text"
                    required
                    placeholder="Ej: 500g, 2 unidades"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="itemImage" className="block text-sm font-semibold text-gray-700 mb-1">URL de la Imagen (Opcional):</label>
                  <input
                    id="itemImage"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.png"
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Guardar Ingredientes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CollapsibleSidebarLayout>
  );
}
export default withAuth(InventoryPage);
