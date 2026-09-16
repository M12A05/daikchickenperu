import Link from 'next/link';
import Image from 'next/image';

export default function HeroInicio() {
  return (
    <section className="relative min-h-[100svh] min-h-[100dvh] flex items-center justify-center text-center px-4 overflow-hidden bg-black">
      <Image
        src="/imagenes/imagenfondo.png"
        alt=""
        fill
        priority
        className="z-0 object-cover motion-safe:animate-zoom-in-out opacity-[0.35]"
        sizes="100vw"
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-black/20 to-black/65" aria-hidden="true" />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center mt-12 sm:mt-16 px-2">
        <h1 className="max-w-full text-[clamp(1.75rem,7vw,4.5rem)] font-black mb-1 uppercase tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)] text-dais-cream leading-none flex flex-col gap-1 sm:gap-2">
          <span>EL VERDADERO SABOR DEL POLLO A LA BRASA EN DAIS CHICKEN</span>
        </h1>
        <p className="text-[clamp(1rem,2.5vw,1.5rem)] text-dais-cream mt-5 md:mt-6 mb-6 md:mb-8 font-medium drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)] tracking-wide px-2">
          Sabor que prende, experiencia que te queda.
        </p>
        <Link
          href="/carta"
          className="min-h-12 bg-dais-red hover:bg-red-800 text-white font-bold py-4 px-8 sm:px-9 rounded-xl uppercase tracking-wider text-base md:text-lg transition-transform hover:scale-105 shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-cream/70"
        >
          Haz tu pedido
        </Link>
      </div>
    </section>
  );
}
