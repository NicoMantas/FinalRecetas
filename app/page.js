import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 text-orange-900">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            ReinventandoCocina
          </Link>
          <div className="space-x-4">
            <Link href="/recipes" className="hover:text-orange-500">
              Recetas
            </Link>
            <Link href="/categories" className="hover:text-orange-500">
              Categorías
            </Link>
            <Link href="/blog" className="hover:text-orange-500">
              Blog
            </Link>
            <Link
              href="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Acceder
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Custom Background Image */}
      <main
        className="container mx-auto px-4 py-20 text-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/comida.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-orange-900/50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Reinventa Tu Cocina
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto mb-10">
            Explora un universo de sabores, comparte tus creaciones culinarias y
            conecta con una comunidad apasionada por la gastronomía. ¡Tu próxima
            aventura en la cocina comienza aquí!
          </p>
          <Link
            href="/recipes"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Explorar Recetas
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-orange-700 text-center mb-12">
            ¿Qué puedes hacer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-orange-700 mb-3">
                Descubre Sabores
              </h3>
              <p className="text-gray-700 text-lg">
                Navega por cientos de recetas creativas y tradicionales,
                perfectas para cualquier ocasión.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-orange-700 mb-3">
                Comparte Tu Pasión
              </h3>
              <p className="text-gray-700 text-lg">
                Publica tus propias recetas, trucos de cocina y inspira a otros
                amantes de la gastronomía.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-orange-700 mb-3">
                Aprende y Evoluciona
              </h3>
              <p className="text-gray-700 text-lg">
                Mejora tus habilidades culinarias con consejos, técnicas y el
                apoyo de nuestra comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section with Images */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-orange-700 text-center mb-12">
            Recetas Populares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/pastaalpesto.jpg"
                  alt="Pasta al Pesto"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-orange-700">Pasta al Pesto</h3>
              <p className="text-gray-700 mt-2">Una receta clásica italiana.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/tartademanzana.jpg"
                  alt="Tarta de Manzana"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-orange-700">Tarta de Manzana</h3>
              <p className="text-gray-700 mt-2">Postre dulce y fácil de hacer.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/lentejas.jpg"
                  alt="Sopa de Lentejas"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-orange-700">Sopa de Lentejas</h3>
              <p className="text-gray-700 mt-2">Sabor casero y reconfortante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search Section */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-orange-700 mb-6">
            Busca tu receta
          </h2>
          <div className="flex justify-center items-center gap-4">
            <input
              type="text"
              placeholder="Ingredientes o nombre de receta"
              className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm"
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg">
              Buscar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}