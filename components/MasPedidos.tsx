"use client";

import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import type { CatalogItem } from '@/lib/catalog';
import { WHATSAPP_NUMBER } from '@/lib/siteConfig';

function ProductCard({ product }: { product: CatalogItem }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [feedback, setFeedback] = useState('');

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-shadow hover:shadow-xl">
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 md:h-52">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="relative flex flex-1 flex-col p-5 text-left">
        <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-dais-dark md:text-xl">{product.name}</h3>
        <p className="mb-6 flex-1 text-sm font-medium uppercase leading-relaxed text-gray-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-2xl font-black text-dais-red">S/ {product.price.toFixed(2)}</span>
          <button
            type="button"
             onClick={() => {
               addToCart(product.id);
               setFeedback(`${product.name} añadido al carrito.`);
             }}
            aria-label={`Añadir ${product.name} al carrito`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-dais-red text-white shadow-md transition-transform hover:scale-110 hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/40"
          >
            <Plus className="h-6 w-6 stroke-[3]" aria-hidden="true" />
           </button>
           <span className="sr-only" role="status" aria-live="polite">{feedback}</span>
        </div>
      </div>
    </article>
  );
}

export default function MasPedidos({
  products: allProducts,
  catalogError,
}: {
  products: CatalogItem[];
  catalogError: string | null;
}) {
  const featuredProducts = allProducts.filter((product) => product.featured);
  const products = (featuredProducts.length > 0 ? featuredProducts : allProducts).slice(0, 3);

  if (catalogError) {
    return (
      <section role="alert" className="bg-transparent px-4 py-14 text-center md:px-12">
        <h2 className="text-2xl font-black uppercase text-dais-dark">La carta no está disponible temporalmente</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">Puedes consultar disponibilidad y realizar tu pedido escribiéndonos por WhatsApp.</p>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-xl bg-[#075E54] px-6 py-3 font-bold uppercase tracking-wide text-white hover:bg-[#064c44] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]">
          Consultar por WhatsApp
        </a>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-transparent px-4 py-14 text-center md:px-12">
        <h2 className="text-2xl font-black uppercase text-dais-dark">Nuestra carta se está actualizando</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">Consulta los platos disponibles directamente con nuestro equipo.</p>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-xl bg-[#075E54] px-6 py-3 font-bold uppercase tracking-wide text-white hover:bg-[#064c44] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]">
          Consultar por WhatsApp
        </a>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-14 md:px-12">
      <div className="absolute inset-0 bg-white/40" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-4 flex items-end justify-between md:mb-8">
          <h2 className="text-xl font-black uppercase tracking-tight text-dais-dark sm:text-2xl md:text-3xl">Los más pedidos</h2>
          <Link href="/carta" className="hidden items-center py-3 text-base font-black uppercase tracking-widest text-red-600 transition-colors hover:text-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/40 md:flex">
            Ver catálogo completo <ChevronRight className="ml-1 h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/carta" className="inline-flex items-center py-3 text-red-600 font-black uppercase tracking-widest hover:text-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/40">
            Ver catálogo completo <ChevronRight className="ml-1 h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
