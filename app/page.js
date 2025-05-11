import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-orange-800 mb-4">
            ¡Bienvenido a Reinventando la Cocina!
          </h1>

          <p className="text-xl md:text-2xl text-orange-700 max-w-2xl">
            Descubre, comparte y crea deliciosas recetas con nuestra comunidad
            de amantes de la cocina
          </p>

          <div className="mt-8">
            <Link
              href="/log-in"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ¡Vamos a cocinar!
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">
                Explora Recetas
              </h3>
              <p className="text-gray-600">
                Descubre nuevas recetas de nuestra comunidad
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">
                Comparte tus Creaciones
              </h3>
              <p className="text-gray-600">
                Comparte tus mejores recetas con otros
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">
                Aprende y Crece
              </h3>
              <p className="text-gray-600">Mejora tus habilidades culinarias</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
