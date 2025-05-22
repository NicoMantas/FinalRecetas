"use client";
import { useState, useEffect } from "react";
import withAuth from "../components/withAuth";
import { auth } from "../../firebase/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import CollapsibleSidebarLayout from "../components/CollapsibleSidebarLayout";
import Link from "next/link";
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Cargando...",
    email: "Cargando...",
    photoUrl: "https://via.placeholder.com/80", // Placeholder image
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "Usuario",
        email: currentUser.email || "",
        photoUrl: currentUser.photoURL || "https://randomuser.me/api/portraits/men/44.jpg",
      });
      setNewName(currentUser.displayName || "Usuario");
    } else {
        toast.error("Usuario no encontrado, por favor inicia sesión.");
        router.push("/log-in");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Cierre de sesión exitoso.");
      router.push("/log-in");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Hubo un error al cerrar sesión: " + error.message);
    }
  };

  const handleOpenSettingsModal = () => {
    setNewName(user.name);
    setIsSettingsModalOpen(true);
  };

  const handleUpdateSettings = async () => {
    setSettingsLoading(true);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("No hay usuario autenticado. Intenta iniciar sesión de nuevo.");
      setSettingsLoading(false);
      setIsSettingsModalOpen(false);
      router.push("/log-in");
      return;
    }

    if (newName.trim() === '') {
      toast.error("El nombre de usuario no puede estar vacío.");
      setSettingsLoading(false);
      return;
    }

    try {
      if (newName.trim() !== user.name) {
        await updateProfile(currentUser, { displayName: newName.trim() });
        setUser(prev => ({ ...prev, name: newName.trim() })); 
        toast.success("Nombre de usuario actualizado con éxito.");
      } else {
        toast.info("El nombre de usuario es el mismo, no se realizaron cambios.");
      }
      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar el nombre: " + error.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Styles for the main content area of the profile page (orange background)
  const profilePageMainStyle = {
    background: "#f68706",
    padding: "2rem", // Using rem for padding, equivalent to p-8 in Tailwind
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%"
  };

  return (
    <CollapsibleSidebarLayout>
      <Toaster position="top-center" reverseOrder={false} />
      <div style={profilePageMainStyle}>
        {/* Profile Card - Refactored with Tailwind CSS */}
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-md md:max-w-lg transform transition-all duration-500 hover:scale-105">
          <div className="text-center">
            <Image
              src={user.photoUrl}
              alt="User"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto object-cover border-4 border-orange-400 shadow-lg"
              width={112}
              height={112}
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-6 mb-1">
              {user.name}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 break-all">
              {user.email}
            </p>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleOpenSettingsModal}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Settings
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a // Changed button to a styled <a> tag for direct navigation
                href="/list-recipes"
                className="flex flex-col items-center justify-center bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold py-4 px-4 rounded-lg shadow hover:shadow-md transition-all duration-300 text-center"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-2 text-sky-600">
                  <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" opacity="0.3" />
                  <circle cx="8" cy="10" r="2" fill="currentColor" />
                  <path d="M5 17l4-5 4 3 4-6 2 3v5z" fill="currentColor" opacity="0.6" />
                </svg>
                Recipes
              </a>
              <Link
                href="/favorites"
                className="flex flex-col items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold py-4 px-4 rounded-lg shadow hover:shadow-md transition-all duration-300"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-2 text-rose-600">
                  <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" opacity="0.3" />
                  <path d="M12 9.5l1.09 2.21 2.41.35-1.75 1.71.41 2.39L12 14.77l-2.16 1.14.41-2.39-1.75-1.71 2.41-.35L12 9.5z" fill="#f6c177" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                Favourite
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mt-2"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Settings Modal - Refactored with Tailwind CSS */}
        {isSettingsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
                Actualizar Nombre de Usuario
              </h2>
              
              <div className="mb-6">
                <label htmlFor="userNameInput" className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario:</label>
                <input 
                  type="text" 
                  id="userNameInput"
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button" // Explicit type to prevent form submission if wrapped in form later
                  onClick={() => setIsSettingsModalOpen(false)}
                  disabled={settingsLoading}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={handleUpdateSettings}
                  disabled={settingsLoading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-300 disabled:opacity-50 disabled:bg-indigo-400"
                >
                  {settingsLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Actualizando...
                    </div>
                  ) : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CollapsibleSidebarLayout>
  );
}

export default withAuth(UserProfilePage);
