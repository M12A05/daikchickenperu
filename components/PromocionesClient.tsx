'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Tag, Flame, Clock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { CatalogItem } from '@/lib/catalog';
import { useState } from 'react';

export default function PromocionesClient({
  promos,
  catalogError,
}: {
  promos: CatalogItem[];
  catalogError: string | null;
}) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [cartFeedback, setCartFeedback] = useState('');

  return (
    <div className="relative min-h-screen pb-14 bg-transparent z-0">
      <div 
        className="absolute inset-0 z-[-1] opacity-80 bg-fixed bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/fondodelpolloblanco.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[-1] bg-white/40 pointer-events-none" aria-hidden="true" />
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{cartFeedback}</p>
       <div className="pt-[calc(7rem+env(safe-area-inset-top))] pb-14 px-4 text-center relative overflow-hidden bg-black text-white">
        <Image
          src="/pollofuego.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-dais-dark font-black px-4 py-1.5 rounded-full text-xs sm:text-sm uppercase tracking-widest mb-4 shadow-lg">
            <Flame className="w-4 h-4 fill-dais-dark" aria-hidden="true" /> Ofertas Exclusivas Web
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight drop-shadow-lg">
            Promociones del Día
          </h1>
         <p className="text-yellow-200 text-base sm:text-lg font-bold mt-3 max-w-2xl mx-auto drop-shadow">
           ¡Disfruta del mejor sabor brasa con los descuentos y combos más brutales de la ciudad!
         </p>
       </div>
      </div>
       <div className="relative w-full h-[30px] md:h-[50px] -mt-[1px] z-10 pointer-events-none">
         <svg className="w-full h-full block" viewBox="0 0 1200 120" preserveAspectRatio="none">
           <path d="M0,0 Q600,120 1200,0 L1200,0 L0,0 Z" fill="black" />
         </svg>
       </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <article id={`promocion-${promo.id}`} key={promo.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group relative">
              <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-2">
                <div className="min-w-0 max-w-[55%] break-words bg-dais-red text-white font-black text-xs uppercase px-3 py-1.5 rounded-full shadow-md tracking-wider">
                {promo.badge}
                </div>
                <div className="min-w-0 max-w-[55%] break-words bg-yellow-400 text-dais-dark font-black text-xs uppercase px-3 py-1.5 rounded-full shadow-md tracking-wider flex items-start gap-1">
                  <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {promo.savings}
                </div>
              </div>

              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <Image
                  src={promo.image}
                  alt={promo.name}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" aria-hidden="true" />
              </div>

              <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                  <Clock className="w-3.5 h-3.5 text-dais-red" aria-hidden="true" />
                  {promo.expires_at
                     ? `Vigente hasta ${new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeZone: 'America/Lima' }).format(new Date(promo.expires_at))}`
                    : 'Oferta vigente'}
                </div>
                <h2 className="font-black text-xl text-dais-dark uppercase leading-tight mb-2 group-hover:text-dais-red transition-colors">
                  {promo.name}
                </h2>
                <p className="text-gray-600 text-sm font-medium leading-relaxed flex-1 mb-5">{promo.description}</p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    {promo.original_price != null && (
                      <span className="text-xs text-gray-500 line-through font-bold block">Antes S/ {promo.original_price.toFixed(2)}</span>
                    )}
                    <span className="text-2xl font-black text-dais-red">S/ {promo.price.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                     onClick={() => {
                       addToCart(promo.id);
                       setCartFeedback(`${promo.name} añadido al carrito.`);
                     }}
                    aria-label={`Añadir ${promo.name} al carrito`}
                     className="min-h-11 bg-dais-red hover:bg-red-800 text-white font-black py-3 px-4 sm:px-5 rounded-2xl flex items-center gap-2 transition-transform hover:scale-105 shadow-md uppercase text-xs tracking-wider"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" aria-hidden="true" /> Añadir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {catalogError && (
          <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center shadow-sm">
            <p className="text-xl font-black uppercase tracking-wide text-red-900">No podemos cargar las promociones</p>
            <p className="mt-2 text-red-800">Revisa nuestra carta o inténtalo nuevamente más tarde.</p>
          </div>
        )}
         {!catalogError && promos.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-xl font-black uppercase tracking-wide text-dais-dark">No hay promociones activas</p>
            <p className="mt-2 text-gray-600">Revisa nuestra carta para conocer todos los productos disponibles.</p>
            <Link href="/carta" className="mt-6 inline-flex rounded-xl bg-dais-dark px-6 py-3 font-bold uppercase tracking-wide text-white hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/40">
              Ver la carta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
