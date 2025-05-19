'use client';

import { useState, useEffect } from 'react';
// Image de next/image ya no es necesario si no mostramos imágenes del inventario
// import Image from 'next/image'; 
import withAuth from "../components/withAuth";
import CollapsibleSidebarLayout from '../components/CollapsibleSidebarLayout';
import {
  getInventoryItems,
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem
} from '../../firebase/inventoryService'; // Ajusta la ruta si es necesario

function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  // newItemImageFile ya no es necesario

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  // editItemImageFile ya no es necesario

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getInventoryItems();
      setInventoryItems(items);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setError(err.message || 'Error al cargar el inventario.');
    } finally {
      setIsLoading(false);
    }
  };

  // handleNewImageChange y handleEditImageChange ya no son necesarios

  const handleDelete = async (itemId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      setIsLoading(true);
      try {
        await deleteInventoryItem(itemId);
        fetchItems(); 
      } catch (err) {
        console.error("Error deleting item:", err);
        setError(err.message || 'Error al eliminar el ingrediente.');
      } finally {
        setIsLoading(false); // Asegurar que isLoading se desactive
      }
    }
  };

  const handleOpenCreateModal = () => {
    setNewItemName('');
    setNewItemQuantity('');
    // setNewItemImageFile(null); // ya no existe
    setError('');
    setShowCreateModal(true);
  };

  const handleCreateIngredient = async (e) => {
    e.preventDefault();
    if (!newItemName || newItemQuantity === '') { // Ya no se valida newItemImageFile
      setError("Por favor, ingresa el nombre y la cantidad del ingrediente.");
      return;
    }
    const quantity = parseFloat(newItemQuantity);
    if (isNaN(quantity) || quantity < 0) {
        setError("La cantidad debe ser un número positivo.");
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // addInventoryItem ya no toma newItemImageFile
      await addInventoryItem(newItemName, quantity);
      setShowCreateModal(false);
      fetchItems(); 
    } catch (err) {
      console.error("Error creating ingredient:", err);
      setError(err.message || 'Error al crear el ingrediente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemQuantity(String(item.quantity));
    // setEditItemImageFile(null); // ya no existe
    setError('');
    setShowEditModal(true);
  };

  const handleUpdateIngredient = async (e) => {
    e.preventDefault();
    if (!editingItem || !editItemName || editItemQuantity === '') {
      setError("Nombre y cantidad son requeridos para editar.");
      return;
    }
    const quantity = parseFloat(editItemQuantity);
    if (isNaN(quantity) || quantity < 0) {
        setError("La cantidad debe ser un número positivo.");
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const dataToUpdate = {
        name: editItemName,
        quantity: quantity,
      };
      // updateInventoryItem ya no toma editItemImageFile
      await updateInventoryItem(editingItem.id, dataToUpdate);
      setShowEditModal(false);
      setEditingItem(null);
      fetchItems(); 
    } catch (err) {
      console.error("Error updating ingredient:", err);
      setError(err.message || 'Error al actualizar el ingrediente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && inventoryItems.length === 0) { 
    return (
      <CollapsibleSidebarLayout>
        <div className="p-4 md:p-8 flex justify-center items-center min-h-screen">
          <p className="text-xl text-orange-600">Cargando inventario...</p>
        </div>
      </CollapsibleSidebarLayout>
    );
  }

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

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {isLoading && inventoryItems.length > 0 && <p className="text-center text-orange-600 mb-4">Actualizando...</p>}

          {inventoryItems.length === 0 && !isLoading ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-lg">
              {/* Puedes mantener o cambiar esta imagen estática de inventario vacío */}
              <img src="/images/empty-inventory.svg" alt="Inventario Vacío" className="mx-auto h-40 w-40 mb-6" width={160} height={160} />
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
              {inventoryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Sección de imagen eliminada */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-orange-700 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-1">Cantidad: {item.quantity}</p>
                    <p className="text-gray-500 text-xs mb-3">ID: {item.id}</p> 
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-300 text-sm font-medium shadow-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-300 text-sm font-medium shadow-md"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Creación */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
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
                  <label htmlFor="itemQuantity" className="block text-sm font-semibold text-gray-700 mb-1">Cantidad (número):</label>
                  <input
                    id="itemQuantity"
                    type="number"
                    required
                    placeholder="Ej: 0.5, 10"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    min="0"
                    step="any"
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                  />
                </div>
                {/* Campo de imagen eliminado */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Ingrediente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
              <h2 className="text-2xl font-bold text-orange-700 mb-6">Editar Ingrediente</h2>
              <form onSubmit={handleUpdateIngredient} className="space-y-4">
                <div>
                  <label htmlFor="editItemName" className="block text-sm font-semibold text-gray-700 mb-1">Nombre:</label>
                  <input
                    id="editItemName"
                    type="text"
                    required
                    value={editItemName}
                    onChange={(e) => setEditItemName(e.target.value)}
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="editItemQuantity" className="block text-sm font-semibold text-gray-700 mb-1">Cantidad (número):</label>
                  <input
                    id="editItemQuantity"
                    type="number"
                    required
                    value={editItemQuantity}
                    onChange={(e) => setEditItemQuantity(e.target.value)}
                    min="0"
                    step="any"
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                {/* Campo de imagen eliminado */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Actualizando...' : 'Actualizar Ingrediente'}
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
