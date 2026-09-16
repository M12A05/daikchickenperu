"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  '/imagenes/lunes-1920x475.png',
  '/imagenes/miercoles-1920x475.png',
  '/imagenes/viernes-1920x475.png'
];

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, reducedMotion]);

  const goToSlide = (index: number) => {
    setCurrentSlide((index + images.length) % images.length);
  };

  return (
    <section
      className="w-full relative overflow-hidden bg-[#151515] aspect-[4/1] max-w-[1920px] mx-auto shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      {/* Sombra base inferior original */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>

      {images.map((image, index) => {
        const isActive = currentSlide === index;

        return (
          <Link
            href="/promociones"
            key={image}
            className={`absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${images.length}`}
            aria-hidden={!isActive}
            tabIndex={isActive ? undefined : -1}
          >
            <Image
              src={image}
              alt={`Promoción Dais Chicken ${index + 1}`}
              fill
              className={`object-contain object-center motion-reduce:animate-none ${
                 isActive ? 'animate-zoom-in-slow' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes="(max-width: 1920px) 100vw, 1920px"
            />
          </Link>
        );
      })}

      <div className="absolute inset-x-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => goToSlide(currentSlide - 1)}
          className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-black/45 text-white shadow-md transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/80"
          aria-label="Promoción anterior"
        >
          <ChevronLeft className="mx-auto h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => goToSlide(currentSlide + 1)}
          className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-black/45 text-white shadow-md transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/80"
          aria-label="Siguiente promoción"
        >
          <ChevronRight className="mx-auto h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Controles del carrusel */}
      <div className="absolute bottom-0.5 md:bottom-2 left-0 right-0 flex items-center justify-center gap-1 md:gap-2 z-20">
        {images.map((_, index) => (
          <button
            type="button"
            key={index}
             onClick={() => goToSlide(index)}
            className={`min-w-11 min-h-11 p-3 rounded-full shadow-md transition-all duration-300 ${
              currentSlide === index ? 'bg-yellow-400' : 'bg-transparent hover:bg-white/20'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
            aria-pressed={currentSlide === index}
          >
            <span className={`block w-2 h-2 md:w-3 md:h-3 mx-auto rounded-full ${currentSlide === index ? 'bg-dais-dark' : 'bg-white/80'}`} />
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Promoción {currentSlide + 1} de {images.length}</p>
    </section>
  );
}
