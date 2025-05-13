"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebase"; // Ajusta la ruta si es necesario
import { onAuthStateChanged } from "firebase/auth";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
          router.push("/log-in"); // Redirige si no hay usuario
        }
        setLoading(false);
      });

      // Limpiar la suscripción al desmontar
      return () => unsubscribe();
    }, [router]);

    if (loading) {
      // Puedes mostrar un spinner de carga aquí
      return <div>Cargando...</div>;
    }

    if (!user) {
      // Aunque ya redirigimos en el useEffect, esto es una salvaguarda
      // o para el caso en que el router.push aún no haya completado.
      return null; // O un mensaje/componente de "Redirigiendo..."
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth; 