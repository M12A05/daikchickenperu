"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const carouselData = [
  {
    title: "¡PROMO MEDIODÍA: 1/4 DE POLLO + GASEOSA GRATIS!",
    subtitle: "¡EL ALMUERZO PERFECTO PARA RECARGAR ENERGÍAS!",
    badge: "HORA DEL ALMUERZO",
    desc: "De Lunes a Viernes de 12:00pm a 3:00pm, te regalamos la bebida personal por la compra de tu cuarto de pollo a la brasa."
  },
  {
    title: "¡MARTES LOCURA: LLEVAS 1 POLLO Y MEDIO!",
    subtitle: "¡HOY COMEMOS TODOS, PAGA 1 Y TE DAMOS 1.5!",
    badge: "MARTES DAIS",
    desc: "Aprovecha la promoción de hoy. Por la compra de 1 pollo entero, te enviamos 1/2 pollo extra totalmente gratis. ¡Ideal para la familia!"
  },
  {
    title: "¡COMBO NOCHERO: MOSTRITO A MITAD DE PRECIO!",
    subtitle: "¡LA COMBINACIÓN PERFECTA DE CHAUFA Y BRASA!",
    badge: "PROMO NOCTURNA",
    desc: "A partir de las 8:00pm, todos nuestros 'Mostritos' vienen con 50% de descuento en la segunda orden. ¡Una cena espectacular!"
  }
];

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Autoplay del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 6000); // Cambia cada 6 segundos
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="text-white py-6 px-4 overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]"
      style={{ background: 'radial-gradient(circle at 50% 50%, #ef4444 0%, #c03333 45%, #7f1d1d 100%)' }}
    >
      {/* Textura de fondo sutil (estilo cómic/promo) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:20px_20px]"></div>
      {/* Sombra suave en la parte inferior para dar profundidad */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-around text-center md:text-left z-10 relative">
        
        {/* Mascota Animada Variante por Slide */}
        <div 
          key={`mascot-${currentSlide}`}
          className={`w-48 md:w-64 mb-4 md:mb-0 flex-shrink-0 relative ${
            !hasAnimated ? 'opacity-0' : 
            currentSlide === 0 ? 'animate-jump-in' : 
            currentSlide === 1 ? 'animate-tada' : 
            'animate-bounce-double'
          }`}
        >
          <Image 
            src="/mascotmarca.webp" 
            alt="Mascota Dais Chicken"
            width={256}
            height={256}
            className="w-full h-auto drop-shadow-lg"
          />
        </div>

        {/* Contenido del Carrusel */}
        <div className="md:ml-8 flex-1 transition-all duration-500 ease-in-out w-full overflow-hidden" key={`title-${currentSlide}`}>
          <h2 className="text-base sm:text-xl md:text-4xl font-black uppercase tracking-tight mb-2 italic drop-shadow-md animate-pulse [overflow-wrap:anywhere]">
            {carouselData[currentSlide].title}
          </h2>
          <p className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-yellow-300 drop-shadow-md [overflow-wrap:anywhere]">
            {carouselData[currentSlide].subtitle}
          </p>
        </div>

        <div className="mt-4 md:mt-0 md:ml-8 border-t-2 md:border-t-0 md:border-l-2 border-white/30 pt-4 md:pt-0 md:pl-8 text-sm md:text-right md:max-w-xs transition-all duration-500 ease-in-out" key={`desc-${currentSlide}`}>
          <p className="font-black uppercase tracking-widest mb-2 text-lg inline-block bg-white text-dais-red px-3 py-1 rounded-full shadow-sm">
            {carouselData[currentSlide].badge}
          </p>
          <p className="text-white/95 leading-relaxed font-medium [overflow-wrap:anywhere]">
            {carouselData[currentSlide].desc}
          </p>
        </div>
      </div>

      {/* Controles del Carrusel (Puntos) */}
      <div className="flex justify-center mt-3 space-x-3 relative z-20">
        {carouselData.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`p-2 flex items-center justify-center ${currentSlide === index ? '' : 'hover:opacity-80'}`}
            aria-label={`Ir al slide ${index + 1}`}
            aria-current={currentSlide === index ? 'true' : undefined}
          >
            <span className={`block w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-yellow-300 scale-125 w-6' : 'bg-white/40 hover:bg-white/80'}`}></span>
          </button>
        ))}
      </div>
    </section>
  );
}
