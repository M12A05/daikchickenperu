"use client";
import React from 'react';
import Image from 'next/image';
import { Plus, Tag, Flame, Clock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const PROMOS = [
  {
    id: 901,
    name: "Combo Familiar Dais",
    desc: "1 Pollo a la leña + Papas familiares + Ensalada grande + Gaseosa 1.5 Lt. + 4 cremas de la casa.",
    originalPrice: 89.00,
    price: 74.00,
    badge: "MÁS VENDIDO 🔥",
    savings: "Ahorras S/ 15.00",
    image: "/carta menu/pollo.webp",
    expires: "Válido todos los días"
  },
  {
    id: 902,
    name: "Promo Dúo Leño",
    desc: "1/2 Pollo a la leña + Papas crocantes + Ensalada clásica + 2 Bebidas personales a elección.",
    originalPrice: 48.00,
    price: 39.90,
    badge: "PROMO PAREJA ⚡",
    savings: "Ahorras S/ 8.10",
    image: "/carta menu/pollo.webp",
    expires: "De Lunes a Viernes"
  },
  {
    id: 903,
    name: "Martes de Pollo & Medio",
    desc: "Por la compra de 1 Pollo a la leña entero, te regalamos 1/2 Pollo extra ¡Totalmente Gratis!",
    originalPrice: 99.00,
    price: 69.00,
    badge: "OFERTA DEL DÍA 🎁",
    savings: "Ahorras S/ 30.00",
    image: "/carta menu/pollo.webp",
    expires: "Solo los días Martes"
  },
  {
    id: 904,
    name: "Banquete Parrillero",
    desc: "1/2 Pollo + Baby Bife 250g + 2 Anticuchos de res + 2 Chorizos + Papas + Ensalada Parrillera.",
    originalPrice: 115.00,
    price: 95.00,
    badge: "PREMIUM 👑",
    savings: "Ahorras S/ 20.00",
    image: "/carta menu/parrillas.webp",
    expires: "Válido Fines de Semana"
  },
  {
    id: 905,
    name: "Combo Alitas Fest (12 und)",
    desc: "12 Alitas (BBQ o Acevichadas) + Papas doradas + 2 Cervezas o Gaseosas 500ml.",
    originalPrice: 45.00,
    price: 35.00,
    badge: "SUPER OPORTUNIDAD 🍗",
    savings: "Ahorras S/ 10.00",
    image: "/carta menu/alitas.webp",
    expires: "De 5:00pm a 10:00pm"
  },
  {
    id: 906,
    name: "Mostrito Nochero",
    desc: "1/4 Pollo a la leña + Arroz Chaufa especial + Papas fritas crocantes + Chicha morada 500ml.",
    originalPrice: 32.00,
    price: 24.90,
    badge: "NOCHE BRASA 🌙",
    savings: "Ahorras S/ 7.10",
    image: "/carta menu/criollos.webp",
    expires: "A partir de las 7:00pm"
  }
];

export default function PromocionesPage() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-pattern min-h-screen pb-14">
      {/* Hero Portada Promociones */}
      <div className="pt-28 pb-14 px-4 text-center shadow-xl relative overflow-hidden bg-gradient-to-r from-red-950 via-dais-red to-red-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-dais-dark font-black px-4 py-1.5 rounded-full text-xs sm:text-sm uppercase tracking-widest mb-4 shadow-lg">
            <Flame className="w-4 h-4 fill-dais-dark" /> Ofertas Exclusivas Web
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight drop-shadow-lg">
            Promociones del Día
          </h1>
          <p className="text-yellow-200 text-base sm:text-lg font-bold mt-3 max-w-2xl mx-auto drop-shadow">
            ¡Disfruta del mejor sabor brasa con los descuentos y combos más brutales de la ciudad!
          </p>
        </div>

        {/* Separador curvo */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-20">
          <svg className="relative block w-full h-[30px] md:h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,120 C600,0 1200,120 1200,120 Z" fill="#F8F9FA" />
          </svg>
        </div>
      </div>

      {/* Grid de Promociones */}
      <div className="max-w-7xl mx-auto px-4 mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMOS.map((promo) => (
            <div 
              key={promo.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group relative"
            >
              {/* Badge destacado */}
              <div className="absolute top-4 left-4 z-20 bg-dais-red text-white font-black text-xs uppercase px-3 py-1.5 rounded-full shadow-md tracking-wider">
                {promo.badge}
              </div>

              {/* Tag de ahorro */}
              <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-dais-dark font-black text-xs uppercase px-3 py-1.5 rounded-full shadow-md tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> {promo.savings}
              </div>

              {/* Imagen del plato */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <Image
                  src={promo.image}
                  alt={promo.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Detalle del producto */}
              <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                  <Clock className="w-3.5 h-3.5 text-dais-red" /> {promo.expires}
                </div>

                <h3 className="font-black text-xl text-dais-dark uppercase leading-tight mb-2 group-hover:text-dais-red transition-colors">
                  {promo.name}
                </h3>
                
                <p className="text-gray-600 text-sm font-medium leading-relaxed flex-1 mb-5">
                  {promo.desc}
                </p>

                {/* Precios y botón */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xs text-gray-400 line-through font-bold block">
                      Antes S/ {promo.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl font-black text-dais-red">
                      S/ {promo.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart({ id: promo.id, name: promo.name, price: promo.price, image: promo.image })}
                    className="bg-dais-red hover:bg-red-800 text-white font-black py-3 px-5 rounded-2xl flex items-center gap-2 transition-transform hover:scale-105 shadow-md uppercase text-xs tracking-wider"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" /> Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
