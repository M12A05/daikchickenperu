"use client";
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Zustand Cart
  const { items, toggleCart } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Cerrar el menú móvil al navegar a otra ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Bloquear el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isSolid = !isHome || isScrolled;

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/carta', label: 'Nuestra carta' },
    { href: '/ubicacion', label: 'Ubicación' },
  ];

  return (
    <>
      <nav className={`
        fixed w-full top-0 z-50 flex items-center justify-between transition-all duration-500 text-white px-4 sm:px-6 md:px-12
        ${isSolid ? 'bg-dais-dark shadow-2xl py-4' : 'bg-transparent py-6 md:py-8'}
      `}>
        {/* Contenedor Izquierdo: Logo */}
        <div className="flex-1 flex justify-start min-w-0">
          <Link href="/" className="flex flex-col items-start leading-none relative z-10 text-white flex-shrink-0">
            <span className="font-serif font-black text-[1.3rem] sm:text-[1.5rem] md:text-[2rem] tracking-widest leading-none">DAIS</span>
            <span className="font-serif font-black text-[1.3rem] sm:text-[1.5rem] md:text-[2rem] tracking-widest leading-none">CHICKEN</span>
          </Link>
        </div>

        {/* Contenedor Central: Enlaces de navegación (Desktop) */}
        <div className="hidden lg:flex flex-none items-center justify-center space-x-12 font-bold text-[1.3rem]">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-dais-cream transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contenedor Derecho: Acciones */}
        <div className="flex-1 flex justify-end items-center space-x-2 sm:space-x-6 md:space-x-6 relative z-10 min-w-0">
          {/* Botón Hamburguesa (Solo móvil/tablet) */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 hover:bg-white/10 rounded-full transition-colors group"
            aria-label="Abrir menú"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-7 h-7 text-white group-hover:text-dais-cream transition-colors" />
          </button>

          {/* Carrito de Compras */}
          <button 
            onClick={toggleCart}
            className="relative p-2.5 hover:bg-white/10 rounded-full transition-colors group"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="w-7 h-7 text-white group-hover:text-dais-cream transition-colors" />
            {/* Globo contador del carrito */}
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-dais-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-transparent">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Botón Principal */}
          <Link 
            href="/carta" 
            className="bg-dais-red hover:bg-red-800 text-white font-bold py-3 px-4 sm:px-6 md:px-8 rounded-lg uppercase tracking-wider text-xs sm:text-sm md:text-base transition-colors shadow-lg whitespace-nowrap"
          >
            Haz tu pedido
          </Link>
        </div>
      </nav>

      {/* Overlay del menú móvil */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[140] backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />

      {/* Drawer del menú móvil */}
      <aside 
        className={`fixed right-0 top-0 h-full w-72 sm:w-80 bg-dais-dark text-white z-[150] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Menú de navegación"
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex flex-col leading-none">
            <span className="font-serif font-black text-2xl tracking-widest">DAIS</span>
            <span className="font-serif font-black text-2xl tracking-widest">CHICKEN</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Enlaces de navegación */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  block px-5 py-4 rounded-xl font-bold uppercase text-base transition-colors
                  ${isActive ? 'bg-dais-red text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer del drawer */}
        <div className="p-6 border-t border-white/10">
          <Link
            href="/carta"
            className="w-full bg-dais-red hover:bg-red-800 text-white font-bold py-4 rounded-xl flex items-center justify-center uppercase tracking-wider transition-colors shadow-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Haz tu pedido
          </Link>
        </div>
      </aside>
    </>
  );
}
