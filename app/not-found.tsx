import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center px-4 text-center pt-24 pb-24">
      <p className="font-black text-8xl md:text-9xl text-dais-red leading-none">404</p>
      <h1 className="font-black text-3xl md:text-5xl text-dais-dark uppercase tracking-tighter mt-6">
        Página no encontrada
      </h1>
      <p className="text-gray-500 mt-4 max-w-md">
        Lo sentimos, la página que buscas no existe o fue movida. Pero el pollo a la brasa sí está por aquí.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/"
           className="min-h-12 bg-dais-red hover:bg-red-800 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wider transition-colors shadow-lg"
        >
          Volver al inicio
        </Link>
        <Link
          href="/carta"
           className="min-h-12 bg-dais-dark hover:bg-black text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wider transition-colors shadow-lg"
        >
          Ver la carta
        </Link>
      </div>
    </div>
  );
}
