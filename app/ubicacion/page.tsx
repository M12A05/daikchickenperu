import { MapPin, Clock, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import { SITE_NAME, SITE_OG_IMAGE, SITE_URL, WHATSAPP_NUMBER, PHONE_DISPLAY, ADDRESS, SCHEDULE } from '@/lib/siteConfig'
import MapEmbed from '@/components/MapEmbed'
import LocalImageLightbox from '@/components/LocalImageLightbox'

export const metadata: Metadata = {
  title: 'Ubicación y Contacto',
  description: 'Encuentra Dais Chicken en Roberto Thorndike Galup 1500, Lima 15081. Horario: Lun-Dom 12:00 PM - 11:00 PM. Delivery: 988 497 350.',
  alternates: {
    canonical: `${SITE_URL}/ubicacion`,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: SITE_NAME,
    title: 'Ubicación y Contacto | Dais Chicken',
    description: 'Encuentra Dais Chicken en Roberto Thorndike Galup 1500, Lima 15081.',
    url: `${SITE_URL}/ubicacion`,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: 'Ubicación de Dais Chicken' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubicación y Contacto | Dais Chicken',
    description: 'Encuentra Dais Chicken y coordina tu pedido en Lima.',
    images: [SITE_OG_IMAGE],
  },
}

export default function UbicacionPage() {
  return (
    <div className="relative pb-16 bg-transparent z-0">
      <div 
        className="absolute inset-0 z-[-1] opacity-80 bg-fixed bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/fondodelpolloblanco.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[-1] bg-white/40 pointer-events-none" aria-hidden="true" />
      
      {/* Header Ubicación */}
       <div className="bg-gradient-to-b from-white/90 via-white/70 to-transparent pt-[calc(7rem+env(safe-area-inset-top))] pb-6 px-4 text-center relative">
        <h1 className="text-3xl md:text-5xl font-black text-dais-dark uppercase tracking-tighter relative z-10 drop-shadow-sm">
           Ubicación de Dais Chicken en Lima
        </h1>
        <p className="text-dais-red font-black mt-3 text-base md:text-lg relative z-10 uppercase tracking-widest">
          Ven y disfruta del verdadero sabor a la brasa
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Información del Local */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
             <h2 className="font-black text-xl uppercase text-dais-dark mb-6 border-b border-gray-100 pb-4 relative z-10">Nuestro Local</h2>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start">
                <div className="bg-[#fce4c8] text-dais-red p-3 rounded-xl mr-4 mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-gray-600 uppercase text-xs tracking-widest mb-1">Dirección</h3>
                   <p className="font-medium text-dais-dark">{ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#fce4c8] text-dais-red p-3 rounded-xl mr-4 mt-1">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-gray-600 uppercase text-xs tracking-widest mb-1">Horario de Atención</h3>
                   <p className="font-medium text-dais-dark">{SCHEDULE}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#fce4c8] text-dais-red p-3 rounded-xl mr-4 mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-gray-600 uppercase text-xs tracking-widest mb-1">Delivery / Reservas</h3>
                   <a href={`tel:+51${PHONE_DISPLAY.replace(/\D/g, '')}`} className="font-black text-xl text-dais-red hover:underline">
                     {PHONE_DISPLAY}
                   </a>
                </div>
              </div>
            </div>
            
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 w-full bg-dais-red hover:bg-[#a02a2a] text-white font-bold py-4 rounded-xl flex justify-center items-center transition-colors uppercase tracking-wider relative z-10 shadow-md"
            >
              Contactar por WhatsApp
            </a>
          </div>
          
          {/* Foto del Local (dais.png) */}
          {/* Foto del Local (dais.webp) con Lightbox */}
          <LocalImageLightbox />
        </div>

        {/* Mapa Interactivo */}
          <div id="mapa" className="md:w-2/3">
          <div className="bg-white rounded-3xl shadow-sm p-4 h-full min-h-[300px] md:min-h-[500px] border border-gray-100 relative">
            <MapEmbed />
          </div>
        </div>

      </div>
    </div>
  );
}
