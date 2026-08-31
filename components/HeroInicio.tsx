import Link from 'next/link';
import Image from 'next/image';

export default function HeroInicio() {
  return (
    <section className="relative min-h-[110vh] min-h-[110dvh] flex items-center justify-center text-center px-4 overflow-hidden">
      <Image
        src="/imagenesweb.webp"
        alt=""
        fill
        priority
        className="z-0 object-cover animate-zoom-in-out brightness-[1.15]"
        sizes="100vw"
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-16 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-[4.5rem] lg:text-[5.5rem] font-black mb-4 uppercase tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)] text-dais-cream leading-normal flex flex-col gap-8 md:gap-12">
          <span className="sm:whitespace-nowrap">EL VERDADERO SABOR</span>
          <span className="whitespace-nowrap">DAIS CHICKEN</span>
        </h1>
        <p className="text-lg md:text-3xl text-dais-cream mt-10 md:mt-16 mb-20 font-medium drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)] tracking-wide px-2">
          Sabor que prende, experiencia que te queda.
        </p>
        <Link
          href="/carta"
          className="bg-dais-red hover:bg-red-800 text-white font-bold py-3.5 px-8 rounded-xl uppercase tracking-wider text-sm md:text-base transition-transform hover:scale-105 shadow-xl"
        >
          Haz tu pedido
        </Link>
      </div>
    </section>
  );
}
