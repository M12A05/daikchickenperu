"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const bentoItems = [
  {
    id: 1,
    title: "Pollo a la Brasa",
    subtitle: "Nuestra Receta Maestra",
    image: "/carta menu/carta 1.webp", 
    frontTag: "La Estrella",
    backText: "Nuestra sazón se elabora con rigurosos métodos de amasado y macerado por más de 12 horas. Va directo al horno de carbón natural, protegiendo la textura jugosa y logrando una piel extra crujiente inigualable.",
    span: "col-span-1 lg:col-span-2",
  },
  {
    id: 2,
    title: "Papas Fritas",
    subtitle: "Acompañamientos",
    image: "/carta menu/carta 2.webp", 
    frontTag: "Crocantes",
    backText: "Seleccionamos minuciosamente las mejores papas peruanas, cortadas a diario y fritas al punto exacto de temperatura para garantizar un crunch irresistible en cada bocado.",
    span: "col-span-1 lg:col-span-1",
  },
  {
    id: 3,
    title: "Ensalada Clásica",
    subtitle: "Ingredientes del Día",
    image: "/carta menu/carta 3.webp",
    frontTag: "Frescura",
    backText: "Verduras seleccionadas cuidadosamente desde el campo directo a tu mesa. Una frescura garantizada que contrasta perfectamente con el intenso sabor de nuestro pollo a la leña.",
    span: "col-span-1 lg:col-span-1",
  },
  {
    id: 4,
    title: "Bebidas y Postres",
    subtitle: "Chicha Morada Tradicional",
    image: "/carta menu/carta 4.webp",
    frontTag: "Refrescante",
    backText: "Elaboramos nuestra chicha morada con auténtico maíz morado, piña y especias, hervida a fuego lento para refrescar tu paladar con el verdadero sabor de casa.",
    span: "col-span-1 lg:col-span-2",
  }
];

function BentoCard({ item }: { item: typeof bentoItems[number] }) {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = (e: React.MouseEvent) => {
    // Evitar que el click en táctil interfiera con el hover del escritorio
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) return;
    setFlipped(f => !f);
  };

  return (
    <div 
      className={`group w-full h-full cursor-pointer ${item.span}`}
      style={{ perspective: '1500px' }}
      onClick={toggleFlip}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${item.title}: toca para ${flipped ? 'ocultar' : 'ver'} información`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setFlipped(f => !f);
        }
      }}
    >
      <div 
        className={`
          relative w-full h-full transition-transform duration-[800ms] [transform-style:preserve-3d] shadow-lg rounded-3xl
          group-hover:[transform:rotateY(180deg)]
          ${flipped ? '[transform:rotateY(180deg)]' : ''}
        `}
      >
        {/* Cara Frontal */}
        <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden [backface-visibility:hidden]">
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
          {/* Filtro Oscuro para el Texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-dais-cream text-dais-red font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-3 shadow-sm">
              {item.frontTag}
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide drop-shadow-md leading-tight">
              {item.title}
            </h3>
            <p className="text-gray-200 font-medium text-sm md:text-base mt-2 drop-shadow-md">
              {item.subtitle}
            </p>
          </div>
        </div>

        {/* Cara Trasera (Información) */}
        <div className="absolute inset-0 w-full h-full rounded-3xl overflow-y-auto bg-white text-dais-dark p-5 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-gray-100 shadow-2xl custom-scrollbar">
          <h4 className="text-dais-red font-black text-lg md:text-2xl mb-2 md:mb-4 uppercase tracking-widest border-b border-dais-red/20 pb-2 md:pb-3">
            {item.frontTag}
          </h4>
          <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
            {item.backText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BentoCalidad() {
  return (
    <section className="py-16 px-4 md:px-12 bg-[#FDF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-dais-dark uppercase tracking-tight mb-2">
            El Secreto de Nuestro Sabor
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium">
            Toca o pasa el cursor sobre las tarjetas para descubrir más.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px] sm:auto-rows-[280px] lg:auto-rows-[240px]">
          {bentoItems.map((item) => (
            <BentoCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
