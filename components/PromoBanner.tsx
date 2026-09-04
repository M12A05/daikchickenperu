"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/imagenes/bienvenida1.jpeg',
  '/imagenes/bienvenida2.jpeg',
  '/imagenes/bienvenida3.jpeg'
];

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000); // Cambia automáticamente cada 4 segundos
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="w-full relative overflow-hidden bg-gray-100 aspect-[4/1] max-w-[1920px] mx-auto shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]">
      {/* Sombra base inferior original */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>

      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={img}
            alt={`Promoción Dais Chicken ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="(max-width: 1920px) 100vw, 1920px"
          />
        </div>
      ))}

      {/* Controles del Carrusel (Puntos) */}
      <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center space-x-2 md:space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-md transition-all duration-300 ${
              currentSlide === index ? 'bg-yellow-400 scale-125 md:w-6' : 'bg-white/80 hover:bg-white'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
