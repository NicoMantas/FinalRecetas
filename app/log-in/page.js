// app/login/page.jsx (si usas App Router de Next.js 13+)
"use client";

import { useState } from "react";
import { auth } from "../../firebase/firebase.js"; // Corregir la ruta
import { signInWithEmailAndPassword } from "firebase/auth"; // Removed unused createUserWithEmailAndPassword
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // alert("Inicio de sesión exitoso"); // Consider removing alert for better UX
      router.push("/home"); // Ajusta la ruta según tu página principal
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError("Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.");
      } else if (error.code === 'auth/invalid-email') {
        setError("El formato del correo electrónico no es válido.");
      }
       else {
        setError("Ocurrió un error al iniciar sesión. Por favor, inténtalo más tarde.");
      }
    }
  };

  return (
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
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">
              {error}
            </div>
          )}
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
  );
}
