import { db } from './firebase'; // storage ya no es necesario aquí
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

const INVENTORY_COLLECTION = 'inventory';

/**
 * Adds a new item to the inventory.
 * @param {string} name - The name of the inventory item.
 * @param {number} quantity - The quantity of the inventory item.
 * @returns {Promise<string>} The ID of the newly created inventory item.
 */
export const addInventoryItem = async (name, quantity) => {
  if (!name || quantity === undefined || quantity === null) {
    throw new Error("Name and quantity are required to add an inventory item.");
  }
  if (typeof quantity !== 'number' || quantity < 0) {
    throw new Error("Quantity must be a non-negative number.");
  }

  try {
    const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), {
      name,
      quantity: Number(quantity),
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding inventory item: ", error);
    throw error;
  }
};

/**
 * Retrieves all items from the inventory.
 * @returns {Promise<Array<Object>>} A list of inventory items.
 */
export const getInventoryItems = async () => {
  try {
    const snapshot = await getDocs(collection(db, INVENTORY_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting inventory items: ", error);
    throw error;
  }
};

/**
 * Updates an existing inventory item.
 * @param {string} itemId - The ID of the item to update.
 * @param {Object} dataToUpdate - An object containing the fields to update (e.g., { name, quantity }).
 * @returns {Promise<void>}
 */
export const updateInventoryItem = async (itemId, dataToUpdate) => {
  if (!itemId) {
    throw new Error("Item ID is required to update an inventory item.");
  }
  if (!dataToUpdate || (dataToUpdate.name === undefined && dataToUpdate.quantity === undefined)) {
    throw new Error("No data provided for update (name or quantity).");
  }
  if (dataToUpdate.quantity !== undefined && (typeof dataToUpdate.quantity !== 'number' || dataToUpdate.quantity < 0)) {
    throw new Error("Quantity must be a non-negative number if provided for update.");
  }

  try {
    const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
    const updatePayload = { ...dataToUpdate };
    
    updatePayload.updatedAt = new Date();
    await updateDoc(itemRef, updatePayload);
  } catch (error) {
    console.error("Error updating inventory item: ", error);
    throw error;
  }
};

/**
 * Deletes an inventory item from Firestore.
 * @param {string} itemId - The ID of the item to delete.
 * @returns {Promise<void>}
 */
export const deleteInventoryItem = async (itemId) => {
  if (!itemId) {
    throw new Error("Item ID is required to delete an inventory item.");
  }
  try {
    const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error deleting inventory item: ", error);
    throw error;
  }
};

// Example of how to find an item by name (if needed, though not explicitly requested)
// export const findInventoryItemByName = async (name) => {
//   try {
//     const q = query(collection(db, INVENTORY_COLLECTION), where("name", "==", name));
//     const querySnapshot = await getDocs(q);
//     const items = [];
//     querySnapshot.forEach((doc) => {
//       items.push({ id: doc.id, ...doc.data() });
//     });
//     return items; // Returns an array, as names might not be unique
//   } catch (error) {
//     console.error("Error finding inventory item by name: ", error);
//     throw error;
//   }
// }; 