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
    { href: '/promociones', label: 'Promociones' },
    { href: '/ubicacion', label: 'Ubicación' },
  ];

  return (
    <>
      <nav className={`
        fixed w-full top-0 z-50 flex items-center justify-between transition-all duration-500 text-white px-4 sm:px-6 md:px-12
        ${isSolid ? 'bg-dais-dark shadow-2xl py-4' : 'bg-transparent py-6 md:py-8'}
      `}>
        {/* Contenedor Izquierdo: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="flex flex-col items-start leading-none relative z-20 text-white flex-shrink-0">
            <span className="font-serif font-black text-[1.25rem] sm:text-[1.45rem] md:text-[1.75rem] tracking-widest leading-none">DAIS</span>
            <span className="font-serif font-black text-[1.25rem] sm:text-[1.45rem] md:text-[1.75rem] tracking-widest leading-none">CHICKEN</span>
          </Link>
        </div>

        {/* Contenedor Central: Enlaces de navegación centrado (Desktop) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center space-x-8 xl:space-x-12 font-bold text-[1.05rem] xl:text-[1.15rem] z-30 pointer-events-auto">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-dais-cream transition-colors whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contenedor Derecho: Acciones */}
        <div className="flex justify-end items-center space-x-2 sm:space-x-4 md:space-x-6 relative z-20">
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
            className="relative p-2 hover:bg-white/10 rounded-xl transition-colors group flex items-center gap-2.5 text-white"
            aria-label="Abrir carrito de compras"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-white group-hover:text-dais-cream transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-dais-red text-white text-[10px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-dais-dark shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold text-xs sm:text-xs uppercase tracking-wider group-hover:text-dais-cream transition-colors">
              VER CARRITO
            </span>
          </button>
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
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              toggleCart();
            }}
            className="w-full bg-dais-red hover:bg-red-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-colors shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Ver mi Carrito {cartItemCount > 0 && `(${cartItemCount})`}
          </button>
        </div>
      </aside>
    </>
  );
}
