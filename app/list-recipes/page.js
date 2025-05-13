"use client";
import withAuth from "../components/withAuth";

function ListRecipesPage() {
  // Ejemplo de recetas (esto se reemplazará por datos reales más adelante)
  const recipes = [
    {
      id: 1,
      title: "Ejemplo 1",
      description: "test de la page en este partado debría ir la receta",
    },
    {
      id: 2,
      title: "Ensalada César",
      description: "Clásica ensalada con pollo, lechuga y aderezo especial.",
    },
    {
      id: 3,
      title: "😋😋😊😊",
      description: "creo que acá se listria luego con un array las recetas",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px",
          width: "420px",
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#222",
            marginBottom: "12px",
          }}
        >
          Tus Recetas
        </h1>
        {recipes.length === 0 ? (
          <p style={{ color: "#888", fontSize: "1.1rem" }}>
            No tienes recetas guardadas todavía.
          </p>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                style={{
                  background: "#e6fcf5",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#1a535c",
                  }}
                >
                  {recipe.title}
                </h2>
                <p style={{ margin: "8px 0 12px 0", color: "#444" }}>
                  {recipe.description}
                </p>
                <button
                  style={{
                    background: "#38b2ac",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(ListRecipesPage);
