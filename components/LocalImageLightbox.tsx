'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function LocalImageLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusableElements = document.querySelectorAll<HTMLElement>(
        '#image-lightbox button:not([disabled]), #image-lightbox [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousActiveElement.current?.isConnected) previousActiveElement.current.focus();
      previousActiveElement.current = null;
    };
  }, [isOpen]);

  return (
    <>
      <div 
        className="bg-dais-dark rounded-3xl h-52 overflow-hidden relative shadow-md border border-gray-100 group cursor-pointer"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-label="Ver más de La Casa de DAIS CHICKEN"
      >
        <Image 
          src="/dais.webp" 
          alt="Fachada del local Dais Chicken" 
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:bg-black/40 transition-colors duration-300"></div>
        
        {/* Hover overlay "Ver más" */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-dais-red text-white px-5 py-2 rounded-full font-bold flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">
            VER MÁS
          </div>
        </div>

        <div className="absolute bottom-6 left-6">
           <h3 className="text-white font-black text-xl uppercase tracking-wide drop-shadow-md">La Casa de DAIS CHICKEN</h3>
        </div>
      </div>

      {/* Lightbox Modal via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          id="image-lightbox"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] md:p-10 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <h2 id="lightbox-title" className="sr-only">Fachada de Dais Chicken ampliada</h2>
          <button 
            ref={closeRef}
            className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] z-[210] min-h-11 min-w-11 text-white hover:text-dais-red transition-colors p-2 bg-black/50 rounded-full md:right-8 md:top-8"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar vista"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full max-w-5xl aspect-video max-h-full rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/dais.webp" 
              alt="La Casa de DAIS CHICKEN ampliada" 
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
