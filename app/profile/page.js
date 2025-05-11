"use client";

export default function UserProfilePage() {
  // Datos de ejemplo
  const user = {
    name: "Nombre de usuario",
    email: "Email de usuario",
    photoUrl: "https://randomuser.me/api/portraits/men/44.jpg", //esto es una api de imagenes ramdons
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f68706",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "22px",
          boxShadow: "0 6px 32px rgba(0,0,0,0.13)",
          padding: "38px 32px 32px 32px",
          width: "400px",
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: "bold",
            color: "#222",
            marginBottom: "18px",
            letterSpacing: "0.5px",
          }}
        >
          User Profile
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginBottom: "18px",
            gap: 18,
          }}
        >
          <img
            src={user.photoUrl}
            alt="User"
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #f68706",
              boxShadow: "0 2px 8px rgba(246,135,6,0.10)",
            }}
          />
          <div style={{ flex: 1, marginLeft: 12 }}>
            <div
              style={{
                background: "#3ec6fa",
                borderRadius: "8px",
                padding: "10px 18px 8px 18px",
                color: "#fff",
                fontWeight: "600",
                fontSize: "1.13rem",
                marginBottom: 6,
                boxShadow: "0 1px 4px rgba(62,198,250,0.08)",
              }}
            >
              {user.name}
            </div>
            <div style={{ color: "#666", fontSize: "0.98rem", marginLeft: 2 }}>
              {user.email}
            </div>
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            border: 0,
            borderTop: "1.5px solid #f3f3f3",
            margin: "18px 0 22px 0",
          }}
        />
        <button
          style={{
            width: "100%",
            background: "#8f4cf6",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "13px 0",
            fontWeight: "600",
            fontSize: "1.08rem",
            marginBottom: "28px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#6d2ed6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#8f4cf6")}
        >
          Settings
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "32px",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              background: "#f7f7fd",
              borderRadius: 12,
              padding: "16px 0 10px 0",
              boxShadow: "0 1px 4px rgba(143,76,246,0.04)",
            }}
          >
            {/* Icono de Recetas */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginBottom: 6 }}
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="3"
                fill="#e0e7ff"
                stroke="#7b4cf6"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="10" r="2" fill="#8f4cf6" />
              <path
                d="M5 17l4-5 4 3 4-6 2 3v5z"
                fill="#c7d2fe"
                stroke="#7b4cf6"
                strokeWidth="1.2"
              />
            </svg>
            <button
              style={{
                background: "#7b4cf6",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "7px 18px",
                fontWeight: "500",
                fontSize: "1rem",
                cursor: "pointer",
                marginBottom: 2,
                marginTop: 2,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#6d2ed6")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#7b4cf6")}
            >
              Recipes
            </button>
          </div>
          <div style={{ flex: 0.1 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              background: "#f7f7fd",
              borderRadius: 12,
              padding: "16px 0 10px 0",
              boxShadow: "0 1px 4px rgba(143,76,246,0.04)",
            }}
          >
            {/* Icono de Favoritos */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginBottom: 6 }}
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="3"
                fill="#e0e7ff"
                stroke="#7b4cf6"
                strokeWidth="1.5"
              />
              <path
                d="M12 9.5l1.09 2.21 2.41.35-1.75 1.71.41 2.39L12 14.77l-2.16 1.14.41-2.39-1.75-1.71 2.41-.35L12 9.5z"
                fill="#f6c177"
                stroke="#7b4cf6"
                strokeWidth="1"
              />
            </svg>
            <button
              style={{
                background: "#7b4cf6",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "7px 18px",
                fontWeight: "500",
                fontSize: "1rem",
                cursor: "pointer",
                marginBottom: 2,
                marginTop: 2,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#6d2ed6")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#7b4cf6")}
            >
              Favourite
            </button>
          </div>
        </div>
        <button
          style={{
            width: "70%",
            background: "#4ce69e",
            color: "#222",
            border: "none",
            borderRadius: "8px",
            padding: "12px 0",
            fontWeight: "600",
            fontSize: "1.08rem",
            margin: "0 auto",
            display: "block",
            cursor: "pointer",
            marginTop: 8,
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2fc47a")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4ce69e")}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
