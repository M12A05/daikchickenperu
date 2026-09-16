"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const bentoItems = [
  {
    id: 1,
    title: "Pollo a la Brasa",
    subtitle: "Nuestra Receta Maestra",
    image: "/imagenes/pollobrasa.webp",
    frontTag: "La Estrella",
    backText: "Nuestra sazón se elabora con rigurosos métodos de amasado y macerado por más de 12 horas. Va directo al horno de carbón natural, protegiendo la textura jugosa y logrando una piel extra crujiente inigualable.",
    span: "col-span-1 lg:col-span-2",
  },
  {
    id: 2,
    title: "Papas Fritas",
    subtitle: "Acompañamientos",
    image: "/imagenes/papasfritas.webp",
    frontTag: "Crocantes",
    backText: "Seleccionamos minuciosamente las mejores papas peruanas, cortadas a diario y fritas al punto exacto de temperatura para garantizar un crunch irresistible en cada bocado.",
    span: "col-span-1 lg:col-span-1",
  },
  {
    id: 3,
    title: "Ensalada Clásica",
    subtitle: "Ingredientes del Día",
    image: "/imagenes/ensalada.webp",
    frontTag: "Frescura",
    backText: "Verduras seleccionadas cuidadosamente desde el campo directo a tu mesa. Una frescura garantizada que contrasta perfectamente con el intenso sabor de nuestro pollo a la leña.",
    span: "col-span-1 lg:col-span-1",
  },
  {
    id: 4,
    title: "Cremas",
    subtitle: "Hechas en casa",
    image: "/imagenes/cremas-bg.jpg",
    frontTag: "Caseras",
    backText: "Nuestras cremas como el ají pollero, salsas, y vinagreta son preparadas en casa con recetas exclusivas, garantizando un sabor casero inigualable. (No incluye ketchup ni mayonesa ni mostaza en sachet).",
    span: "col-span-1 lg:col-span-1",
  },
  {
    id: 5,
    title: "Bebidas",
    subtitle: "Limonada Frozen y Más",
    image: "/imagenes/limonadafrozen.webp",
    frontTag: "Refrescante",
    backText: "El complemento perfecto para acompañar tu pollo a la brasa. Deliciosas opciones como nuestra limonada frozen artesanal, preparada al instante con el punto exacto de frescura y limón.",
    span: "col-span-1 lg:col-span-1",
  }
];

function BentoCard({ item }: { item: typeof bentoItems[number] }) {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => {
    setFlipped(f => !f);
  };

  const panelId = `bento-panel-${item.id}`;

  return (
    <article
      className={`${item.span} w-full h-full`}
      style={{ perspective: '1500px' }}
    >
      <button
        type="button"
        className={`group relative block w-full h-full cursor-pointer border-0 bg-transparent p-0 text-left transition-transform duration-[800ms] [transform-style:preserve-3d] shadow-lg rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/50 ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
        onClick={toggleFlip}
        aria-expanded={flipped}
        aria-controls={panelId}
        aria-describedby={flipped ? panelId : undefined}
        aria-label={`${item.title}: ${flipped ? 'ocultar' : 'ver'} información`}
      >
        <div
          aria-hidden={flipped}
          className={`
            absolute inset-0 w-full h-full rounded-3xl overflow-hidden [backface-visibility:hidden]
          `}
        >
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" aria-hidden="true"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
            <span className="rounded-full bg-dais-red px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-lg border border-transparent">
              Ver Información
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide drop-shadow-md leading-tight">
              {item.title}
            </h3>
            <p className="text-gray-200 font-medium text-sm md:text-base mt-2 drop-shadow-md">
              {item.subtitle}
            </p>
          </div>
        </div>

        <div
          id={panelId}
          aria-hidden={!flipped}
          className="absolute inset-0 w-full h-full rounded-3xl overflow-y-auto bg-white text-dais-dark p-5 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-gray-100 shadow-2xl custom-scrollbar"
        >
          <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
            {item.backText}
          </p>
        </div>
      </button>
    </article>
  );
}

export default function BentoCalidad() {
  return (
    <section className="relative bg-transparent py-12 px-4 md:px-12">
      <div className="absolute inset-0 bg-white/40" aria-hidden="true" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-dais-dark uppercase tracking-tight mb-2">
            El Secreto de Nuestro Sabor
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium">
             Toca o selecciona las tarjetas para descubrir más.
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
