'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { CATEGORIES } from '@/lib/catalog';
import type { CatalogItem } from '@/lib/catalog';

export default function CartaClient({
  products,
  catalogError,
}: {
  products: CatalogItem[];
  catalogError: string | null;
}) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [cartFeedback, setCartFeedback] = useState('');
  const categoryMenuButtonRef = useRef<HTMLButtonElement>(null);
  const hadCategoryMenuOpen = useRef(false);

  useEffect(() => {
    if (!isMenuOpen && hadCategoryMenuOpen.current) {
      categoryMenuButtonRef.current?.focus();
    }
    hadCategoryMenuOpen.current = isMenuOpen;
  }, [isMenuOpen]);

  const filteredProducts = products.filter((product) => (
    activeCategory === 'Todos' || product.category === activeCategory
  ));
  const availableCategories = CATEGORIES.filter((category) => (
    category === 'Todos' || products.some((product) => product.category === category)
  ));
  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleAddToCart = (product: CatalogItem) => {
    addToCart(product.id);
    setCartFeedback(`${product.name} añadido al carrito.`);
  };

  return (
    <div className="relative pb-14 bg-transparent z-0">
      <div 
        className="absolute inset-0 z-[-1] opacity-80 bg-fixed bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/fondodelpolloblanco.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[-1] bg-white/40 pointer-events-none" aria-hidden="true" />
       <div className="pt-[calc(7rem+env(safe-area-inset-top))] pb-16 px-4 text-center relative overflow-hidden bg-black">
        <Image
          src="/leñafuego.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-70" />

        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl relative z-10">
          Nuestra Carta
        </h1>
         <p className="text-dais-cream font-bold mt-2 text-base md:text-lg relative z-10 drop-shadow-md">
           Elige tus favoritos y nosotros nos encargamos del resto
         </p>
       </div>
       <div className="relative w-full h-[30px] md:h-[50px] -mt-[1px] z-10 pointer-events-none">
         <svg className="w-full h-full block" viewBox="0 0 1200 120" preserveAspectRatio="none">
           <path d="M0,0 Q600,120 1200,0 L1200,0 L0,0 Z" fill="black" />
         </svg>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8 relative z-10 xl:grid xl:grid-cols-[minmax(220px,1fr)_minmax(0,3fr)]">
         <div className="relative z-30">
           <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 xl:sticky xl:top-28 border border-gray-100 xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto">
            <button
              ref={categoryMenuButtonRef}
              type="button"
               className="w-full min-h-11 flex justify-between items-center xl:hidden text-left"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="category-menu"
            >
              <span className="font-black text-lg uppercase text-dais-dark">
                Menú: <span className="text-dais-red">{activeCategory}</span>
              </span>
              <span className="text-dais-red font-black text-2xl leading-none" aria-hidden="true">
                {isMenuOpen ? '-' : '+'}
              </span>
            </button>

            {isMenuOpen && (
              <div
                  className="fixed inset-0 z-30 xl:hidden"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
            )}

              <h2 className="hidden xl:block font-black text-xl uppercase text-dais-dark mb-4 border-b border-gray-100 pb-4">
              Menú
            </h2>
            <ul
              id="category-menu"
                className={`${isMenuOpen ? 'absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 block max-h-[60vh] overflow-y-auto' : 'hidden'} xl:relative xl:block xl:bg-transparent xl:shadow-none xl:border-none xl:p-0 xl:mt-0 xl:max-h-none space-y-2 z-40`}
            >
               {availableCategories.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      setIsMenuOpen(false);
                        setVisibleCount(9);
                    }}
                     className={`w-full min-h-11 text-left px-5 py-3.5 rounded-xl font-bold uppercase text-sm transition-all ${activeCategory === category ? 'bg-dais-red text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-dais-dark'}`}
                     aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0">
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{cartFeedback}</p>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <article
                  key={product.id}
                  id={`producto-${product.id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group relative"
                >
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden rounded-t-3xl">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform transform-gpu"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1 relative bg-white">
                    <h3 className="font-black text-lg text-dais-dark uppercase leading-tight mb-2 group-hover:text-dais-red transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs font-medium uppercase leading-relaxed flex-1 mb-5">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="font-black text-xl text-dais-red">S/ {product.price.toFixed(2)}</span>
                      <button
                        type="button"
                         onClick={() => handleAddToCart(product)}
                        aria-label={`Añadir ${product.name} al carrito`}
                        className="bg-dais-dark hover:bg-black text-white w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
                      >
                        <Plus className="w-6 h-6 stroke-[3]" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length > visibleCount && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 9)}
                  className="bg-dais-dark hover:bg-black text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-md"
                >
                  Cargar más productos
                </button>
              </div>
            )}

            {catalogError && (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
                <p className="text-xl font-bold text-red-900">No podemos cargar la carta en este momento.</p>
                <p className="mt-2 text-red-800">Escríbenos por WhatsApp o inténtalo nuevamente más tarde.</p>
              </div>
            )}
            {!catalogError && filteredProducts.length === 0 && (
              <div className="text-center py-24">
                <p className="text-2xl font-bold text-gray-500 uppercase tracking-widest">Aún no hay platos aquí.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
