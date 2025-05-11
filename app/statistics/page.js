"use client"; /*se debe usar use client para que el componente se renderice en el cliente*/

export default function StatisticsPage() {
  /*se debe exportar el componente*/
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8b6a0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          background: "#c6f6fa",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px",
          width: "420px",
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#222",
          }}
        >
          Así que, ¿qué tal has estado cocinando?
        </h1>
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            padding: "16px",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "1.1rem",
          }}
        >
          Estadisticas de la semana
        </div>
        <div
          style={{
            width: "100%",
            background: "#e6fcf5",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            padding: "24px",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "1.1rem",
          }}
        >
          Reporte de la semana
        </div>
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            padding: "16px",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "1.05rem",
          }}
        >
          Aora veamos tus estadisticas en graficos
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "12px",
          }}
        >
          {/* Pie Chart SVG */}
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="#222"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M40 40 L40 8 A32 32 0 0 1 72 40 Z"
              fill="#a0e1fa"
              stroke="#222"
              strokeWidth="2"
            />
            <line
              x1="40"
              y1="40"
              x2="40"
              y2="8"
              stroke="#222"
              strokeWidth="3"
            />
          </svg>
          {/* Bar Chart SVG */}
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect
              x="12"
              y="50"
              width="14"
              height="18"
              fill="#a0e1fa"
              stroke="#222"
              strokeWidth="3"
            />
            <rect
              x="32"
              y="36"
              width="14"
              height="32"
              fill="#a0e1fa"
              stroke="#222"
              strokeWidth="3"
            />
            <rect
              x="52"
              y="22"
              width="14"
              height="46"
              fill="#a0e1fa"
              stroke="#222"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
