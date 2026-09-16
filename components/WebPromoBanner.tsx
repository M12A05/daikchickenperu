'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function WebPromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-3 right-3 z-[100] max-h-[calc(100dvh-env(safe-area-inset-bottom)-7rem)] w-auto max-w-[500px] overflow-y-auto rounded-xl border border-white/20 bg-[#111111] shadow-2xl motion-safe:animate-jump-in sm:bottom-4 sm:left-4 sm:right-auto sm:max-h-[calc(100dvh-2rem)]"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(/imagenes/promo-bg.jpg)',
              }}
            />
            {/* Gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/95 via-blue-600/90 to-transparent" />
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-20 min-h-11 min-w-11 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Cerrar promoción"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-5 md:p-6 text-white flex flex-col justify-between h-full">
            <div>
              <h3 className="pr-10 font-black text-lg sm:text-xl md:text-2xl leading-tight mb-4 drop-shadow-md">
                CELEBRA CON NOSOTROS<br />
                <span className="text-yellow-300">QUE YA NOS ENCONTRAMOS EN LA WEB</span>
              </h3>
              <ul className="space-y-2 mb-6 text-sm md:text-base font-medium drop-shadow-sm text-gray-100">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Promociones y cortesías exclusivas, canjeando tu cupón de bienvenida <strong className="text-yellow-300 font-black">&quot;WEB45&quot;</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Local amplio y limpio</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>Buena atención</span>
                </li>
              </ul>
            </div>
            
            <Link 
              href="/carta" 
              className="inline-flex min-h-12 items-center bg-dais-red text-white text-center font-bold text-lg py-3 px-8 rounded-md hover:bg-red-700 transition-colors shadow-lg uppercase tracking-wider self-start"
            >
              PIDE AQUÍ
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
