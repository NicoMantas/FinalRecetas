// app/login/page.jsx (si usas App Router de Next.js 13+)
"use client";

import { useState } from "react";
import { auth, db } from "../../firebase/firebase.js"; // Corregir la ruta e importar db
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore"; // Importar funciones de Firestore
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, ingresa tu correo y contraseña.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Guardar userCredential
      const user = userCredential.user; // Obtener el usuario

      // Actualizar contador de logins
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          // Usar increment para asegurar la atomicidad
          await updateDoc(userDocRef, {
            loginCount: increment(1),
            lastLoginAt: serverTimestamp() // Opcional: guardar la fecha del último login
          });
        } catch (firestoreError) {
          // Si el documento del usuario no existe aún (poco probable si el registro lo crea),
          // o si hay un error al actualizar, lo registramos pero no bloqueamos el login.
          // Considera crear el documento aquí si es un caso de uso posible.
          console.error("Error updating user login stats: ", firestoreError);
          // Podrías querer setearlo si es el primer login y el campo no existe
          // await setDoc(userDocRef, { loginCount: 1, lastLoginAt: serverTimestamp() }, { merge: true });
        }
      }

      toast.success("Inicio de sesión exitoso. Redirigiendo...");
      router.push("/home"); // Ajusta la ruta según tu página principal
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("El formato del correo electrónico no es válido.");
      } else {
        toast.error("Ocurrió un error al iniciar sesión: " + error.message);
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-200 p-4">
        <div className="w-full max-w-md">
          {/* Logo or App Name - Optional */}
          <div className="text-center mb-8">
            <Link href="/" className="text-4xl font-bold text-orange-600">
              ReinventandoCocina
            </Link>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-orange-700">
              Iniciar Sesión
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                  style={{ color: "black" }}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                  style={{ color: "black" }}
                />
                {/* Optional: Add "Forgot password?" link here */}
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                Acceder
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
              ¿Aún no tienes una cuenta?{" "}
              <Link
                href="/register"
                className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
