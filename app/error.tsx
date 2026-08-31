'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center px-4 text-center pt-24 pb-24">
      <p className="font-black text-8xl md:text-9xl text-dais-red leading-none">Oops</p>
      <h1 className="font-black text-3xl md:text-5xl text-dais-dark uppercase tracking-tighter mt-6">
        Algo salió mal
      </h1>
      <p className="text-gray-500 mt-4 max-w-md">
        Ocurrió un error inesperado. Intenta nuevamente o vuelve a la página de inicio.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={reset}
          className="bg-dais-red hover:bg-red-800 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wider transition-colors shadow-lg"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="bg-dais-dark hover:bg-black text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wider transition-colors shadow-lg"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
