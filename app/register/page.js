// app/register/page.jsx (si usas App Router en Next.js 13+)
"use client";
import { useState } from "react";
import { auth } from "../../firebase/firebase.js"; // Ajusta la ruta si es diferente
import { createUserWithEmailAndPassword } from "firebase/auth"; // Removed unused signInWithEmailAndPassword
import { useRouter } from "next/navigation";
import { db } from "../../firebase/firebase.js"; // ajusta la ruta si es diferente
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link"; // Import Link for navigation

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Added error state
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Inténtalo de nuevo.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guarda en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        // Consider adding a displayName or username field if you collect it
        // username: "",
        createdAt: new Date(),
        // Initialize other user-specific fields if needed
        // favorites: [],
        // recipesCount: 0,
      });

      // alert("Registro y guardado exitoso"); // Consider removing for better UX
      router.push("/home"); // Redirect to home or a profile setup page
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError(
          "Este correo electrónico ya está registrado. Intenta iniciar sesión."
        );
      } else if (error.code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido.");
      } else if (error.code === "auth/weak-password") {
        setError(
          "La contraseña es demasiado débil. Intenta con una más segura."
        );
      } else {
        setError(
          "Ocurrió un error durante el registro. Por favor, inténtalo más tarde."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-200 p-4">
      <div className="w-full max-w-md">
        {/* Logo or App Name - Consistent with Login Page */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-orange-600">
            ReinventandoCocina
          </Link>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-orange-700">
            Crear Nueva Cuenta
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-6">
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
                Contraseña (mín. 6 caracteres)
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                style={{ color: "black" }}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder-gray-400"
                style={{ color: "black" }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                isLoading
                  ? "bg-orange-300 text-white cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/log-in"
              className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
