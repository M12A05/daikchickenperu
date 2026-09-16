'use client';

import { useState } from 'react';
import Image from 'next/image';

const MAP_URL = 'https://www.google.com/maps?q=Roberto+Thorndike+Galup+1500,+Lima+15081&output=embed';

export default function MapEmbed() {
  const [isMapReady, setIsMapReady] = useState(false);

  return (
    <div className="relative h-full min-h-[400px] md:min-h-[500px]">
      <iframe
        id="google-map"
        src={MAP_URL}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px', borderRadius: '1rem' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Ubicación de Dais Chicken en Google Maps"
        className="md:min-h-[500px]"
        onLoad={() => setIsMapReady(true)}
      />
      <p className="sr-only" role="status" aria-live="polite">{isMapReady ? 'Mapa de Google cargado.' : 'Cargando mapa de Google.'}</p>
      
      {/* Moto image positioned at the bottom right, facing left */}
      <div className="absolute -bottom-4 -right-12 md:-bottom-8 md:-right-24 z-10 w-48 sm:w-56 md:w-80 pointer-events-none">
        <Image
          src="/motodais.png"
          alt="Delivery en moto"
          width={500}
          height={500}
          className="w-full h-auto drop-shadow-2xl -scale-x-100"
        />
      </div>
    </div>
  );
}
