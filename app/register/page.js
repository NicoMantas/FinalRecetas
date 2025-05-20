"use client";
import { useState } from "react";
import { auth } from "../../firebase/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "../../firebase/firebase.js";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      router.push("/home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Este correo electrónico ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else {
        setError("Ocurrió un error durante el registro.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          'url("/ingredientes.jpg")',
      }}
    >
      <div className="bg-white bg-opacity-95 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-600">
            Bienvenidos a{" "}
            <span className="text-orange-700">ReinventandoCocina</span>
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Contraseña (mín. 6 caracteres)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 text-black"
              required
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

        <p className="mt-6 text-center text-sm text-gray-700">
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
  );
}
