"use client";
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';

// Componente Interno para la tarjeta de producto interactiva
function ProductCard({ id, title, description, price, image }: { id: number, title: string, description: string, price: number, image: string }) {
  const addToCart = useCartStore(state => state.addToCart);
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col hover:shadow-xl transition-shadow group border border-gray-100 cursor-pointer"
      onClick={() => addToCart({ id, name: title, price, image })}
    >
      {/* Imagen Real del Producto */}
      <div className="h-56 md:h-64 w-full bg-gray-100 relative overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform transform-gpu" 
        />
      </div>
      
      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1 relative text-left">
        <h3 className="text-xl md:text-2xl font-black mb-3 uppercase text-dais-dark tracking-wide">{title}</h3>
        <p className="text-gray-600 text-sm mb-6 font-medium uppercase leading-relaxed flex-1">
          {description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span className="text-dais-red font-black text-2xl">S/ {price.toFixed(2)}</span>
          <button className="bg-dais-red hover:bg-red-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-transform shadow-md group-hover:scale-110 group-hover:rotate-90 duration-300">
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MasPedidos() {
  return (
    <section 
      className="py-20 px-4 md:px-12 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/fondodelpolloblanco.webp')" }}
    >
      {/* Overlay sutil para garantizar que el texto y tarjetas sigan resaltando */}
      <div className="absolute inset-0 bg-white/50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-4 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-dais-dark tracking-tight">
            Los más pedidos
          </h2>
          <Link href="/carta" className="hidden md:flex items-center text-red-600 font-black uppercase tracking-widest text-base hover:text-red-800 transition-colors group py-3">
            Ver catálogo completo <ChevronRight className="w-6 h-6 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {/* Tarjetas Verticales */}
          <ProductCard 
            id={105}
            title="1/4 de Pollo"
            description="1/4 Pollo a la brasa + Papas fritas crujientes + Ensalada clásica + Cremas de la casa."
            price={20.00}
            image="/carta menu/carta 1.webp"
          />
          <ProductCard 
            id={104}
            title="1/2 Pollo"
            description="1/2 Pollo a la brasa + Porción generosa de papas + Ensalada fresca + Cremas de la casa."
            price={39.00}
            image="/carta menu/carta 1.webp"
          />
          <ProductCard 
            id={101}
            title="1 Pollo a la Leña"
            description="1 Pollo entero a la brasa + Porción súper familiar de papas + Ensalada grande + Cremas."
            price={64.00}
            image="/carta menu/carta 1.webp"
          />
        </div>

        {/* Botón ver catálogo en móvil */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/carta" className="inline-flex items-center text-red-600 font-black uppercase tracking-widest hover:text-red-800 transition-colors group py-3">
            Ver catálogo completo <ChevronRight className="w-6 h-6 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
