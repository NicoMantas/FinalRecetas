"use client";
import { useState, useEffect } from "react";
import withAuth from "../components/withAuth";
import { auth } from "../../firebase/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import CollapsibleSidebarLayout from "../components/CollapsibleSidebarLayout";

function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Cargando...",
    email: "Cargando...",
    photoUrl: "https://via.placeholder.com/80", // Placeholder image
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "Usuario", // Simpler default
        email: currentUser.email || "",
        photoUrl: currentUser.photoURL || "https://randomuser.me/api/portraits/men/44.jpg",
      });
      setNewName(currentUser.displayName || "Usuario");
    }
  }, []); // Runs once on mount

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/log-in");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un error al cerrar sesión.");
    }
  };

  const handleOpenSettingsModal = () => {
    setNewName(user.name);
    setSettingsError("");
    setIsSettingsModalOpen(true);
  };

  const handleUpdateSettings = async () => {
    setSettingsError("");
    setSettingsLoading(true);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setSettingsError("No hay usuario autenticado.");
      setSettingsLoading(false);
      return;
    }

    try {
      // Update Display Name if changed
      if (newName.trim() !== '' && newName !== user.name) {
        await updateProfile(currentUser, { displayName: newName.trim() });
        setUser(prev => ({ ...prev, name: newName.trim() })); 
      } else if (newName.trim() === '') {
        setSettingsError("El nombre de usuario no puede estar vacío.");
        setSettingsLoading(false);
        return;
      } else {
        // Name is the same or only whitespace changes to the same name, no update needed
      }

      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setSettingsError("Error al actualizar el nombre: " + error.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Styles for the white profile card itself
  const profileCardStyle = {
    background: "#fff",
    borderRadius: "22px",
    boxShadow: "0 6px 32px rgba(0,0,0,0.13)",
    padding: "38px 32px 32px 32px",
    width: "400px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // Styles for Modal (can be moved to a separate CSS file or module later)
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure modal is on top
  };

  const modalContentStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
    width: '450px',
    maxWidth: '90vw',
  };

  const modalLabelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
  };

  const modalInputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const modalButtonStyle = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s ease',
  };

  const modalButtonStyleCancel = {
    ...modalButtonStyle,
    backgroundColor: '#6c757d', // Gray
    color: 'white',
  };

  const modalButtonStyleUpdate = {
    ...modalButtonStyle,
    backgroundColor: '#007bff', // Blue
    color: 'white',
  };

  return (
    <CollapsibleSidebarLayout>
      <div 
        style={{
          background: "#f68706", // Dominant orange background
          padding: "40px 20px",    // Padding around the white card
          display: "flex",         // Use flex to center content
          flexDirection: "column",
          alignItems: "center",     // Center card horizontally
          justifyContent: "center", // Center card vertically
          minHeight: "100%"        // Ensure it tries to fill the parent's height from the layout
        }}
      >
        <div style={profileCardStyle}>
          <h1 style={{ fontSize: "1.7rem", fontWeight: "bold", color: "#222", marginBottom: "18px", letterSpacing: "0.5px" }}>
            User Profile
          </h1>
          <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "18px", gap: 18 }}>
            <img
              src={user.photoUrl}
              alt="User"
              style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", border: "3px solid #f68706", boxShadow: "0 2px 8px rgba(246,135,6,0.10)" }}
            />
            <div style={{ flex: 1, marginLeft: 12 }}>
              <div style={{ background: "#3ec6fa", borderRadius: "8px", padding: "10px 18px 8px 18px", color: "#fff", fontWeight: "600", fontSize: "1.13rem", marginBottom: 6, boxShadow: "0 1px 4px rgba(62,198,250,0.08)" }}>
                {user.name}
              </div>
              <div style={{ color: "#666", fontSize: "0.98rem", marginLeft: 2, wordBreak: 'break-all' }}>
                {user.email}
              </div>
            </div>
          </div>
          <hr style={{ width: "100%", border: 0, borderTop: "1.5px solid #f3f3f3", margin: "18px 0 22px 0" }} />
          <button 
            style={{ width: "100%", background: "#8f4cf6", color: "#fff", border: "none", borderRadius: "14px", padding: "13px 0", fontWeight: "600", fontSize: "1.08rem", marginBottom: "28px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "background 0.2s" }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#6d2ed6")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#8f4cf6")}
            onClick={handleOpenSettingsModal}
          >
            Settings
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "32px", gap: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, background: "#f7f7fd", borderRadius: 12, padding: "16px 0 10px 0", boxShadow: "0 1px 4px rgba(143,76,246,0.04)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 6 }}>
                <rect x="3" y="5" width="18" height="14" rx="3" fill="#e0e7ff" stroke="#7b4cf6" strokeWidth="1.5" />
                <circle cx="8" cy="10" r="2" fill="#8f4cf6" />
                <path d="M5 17l4-5 4 3 4-6 2 3v5z" fill="#c7d2fe" stroke="#7b4cf6" strokeWidth="1.2" />
              </svg>
              <button 
                style={{ background: "#7b4cf6", color: "#fff", border: "none", borderRadius: "10px", padding: "7px 18px", fontWeight: "500", fontSize: "1rem", cursor: "pointer", marginBottom: 2, marginTop: 2, transition: "background 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#6d2ed6")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#7b4cf6")}
              >
                <a href="/list-recipes" className="text-white hover:underline">Recipes</a>
              </button>
            </div>
            <div style={{ flex: 0.1 }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, background: "#f7f7fd", borderRadius: 12, padding: "16px 0 10px 0", boxShadow: "0 1px 4px rgba(143,76,246,0.04)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 6 }}>
                <rect x="3" y="5" width="18" height="14" rx="3" fill="#e0e7ff" stroke="#7b4cf6" strokeWidth="1.5" />
                <path d="M12 9.5l1.09 2.21 2.41.35-1.75 1.71.41 2.39L12 14.77l-2.16 1.14.41-2.39-1.75-1.71 2.41-.35L12 9.5z" fill="#f6c177" stroke="#7b4cf6" strokeWidth="1" />
              </svg>
              <button 
                style={{ background: "#7b4cf6", color: "#fff", border: "none", borderRadius: "10px", padding: "7px 18px", fontWeight: "500", fontSize: "1rem", cursor: "pointer", marginBottom: 2, marginTop: 2, transition: "background 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#6d2ed6")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#7b4cf6")}
              >
                Favourite
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: "70%", background: "#4ce69e", color: "#222", border: "none", borderRadius: "8px", padding: "12px 0", fontWeight: "600", fontSize: "1.08rem", margin: "0 auto", display: "block", cursor: "pointer", marginTop: 8, transition: "background 0.2s" }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2fc47a")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#4ce69e")}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
              Actualizar Nombre de Usuario
            </h2>
            
            {settingsError && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{settingsError}</p>}
            
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="userNameInput" style={modalLabelStyle}>Nombre de Usuario:</label>
              <input 
                type="text" 
                id="userNameInput"
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                style={modalInputStyle}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                style={modalButtonStyleCancel} 
                onClick={() => setIsSettingsModalOpen(false)}
                disabled={settingsLoading}
              >
                Cancelar
              </button>
              <button 
                style={modalButtonStyleUpdate} 
                onClick={handleUpdateSettings}
                disabled={settingsLoading}
              >
                {settingsLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </CollapsibleSidebarLayout>
  );
}

export default withAuth(UserProfilePage);
