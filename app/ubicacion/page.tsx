import { MapPin, Clock, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { WHATSAPP_NUMBER, PHONE_DISPLAY } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Ubicación y Contacto',
  description: 'Encuentra Dais Chicken en Roberto Thorndike Galup 1500, Lima 15081. Horario: Lun-Dom 12:00 PM - 11:00 PM. Delivery: 988 497 350.',
  alternates: {
    canonical: 'https://daischicken.com.pe/ubicacion',
  },
  openGraph: {
    title: 'Ubicación y Contacto | Dais Chicken',
    description: 'Encuentra Dais Chicken en Roberto Thorndike Galup 1500, Lima 15081.',
    url: 'https://daischicken.com.pe/ubicacion',
  },
}

export default function UbicacionPage() {
  return (
    <div className="bg-white pb-20">
      
      {/* Header Ubicación */}
      <div className="bg-white pt-40 pb-8 px-4 text-center relative">
        <h1 className="text-4xl md:text-6xl font-black text-dais-dark uppercase tracking-tighter relative z-10">
          Encuéntranos
        </h1>
        <p className="text-dais-red font-black mt-3 text-lg md:text-xl relative z-10 uppercase tracking-widest">
          Ven y disfruta del verdadero sabor a la brasa
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 flex flex-col md:flex-row gap-8">
        
        {/* Información del Local */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 relative overflow-hidden">
            <h3 className="font-black text-2xl uppercase text-dais-dark mb-6 border-b border-gray-100 pb-4 relative z-10">Nuestro Local</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start">
                <div className="bg-[#fce4c8] text-dais-red p-3 rounded-xl mr-4 mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-1">Dirección</h4>
                  <p className="font-medium text-dais-dark">Roberto Thorndike Galup 1500<br/>Lima 15081, Perú</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#fce4c8] text-dais-red p-3 rounded-xl mr-4 mt-1">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-1">Horario de Atención</h4>
                  <p className="font-medium text-dais-dark">Lunes a Domingo<br/>12:00 PM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#fce4c8] text-dais-red p-3 rounded-xl mr-4 mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-1">Delivery / Reservas</h4>
                  <p className="font-black text-xl text-dais-red">{PHONE_DISPLAY}</p>
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
          <div className="bg-dais-dark rounded-3xl h-64 overflow-hidden relative shadow-md border border-gray-100 group">
            <Image 
              src="/dais.webp" 
              alt="Fachada del local Dais Chicken" 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-6 left-6">
              <h4 className="text-white font-black text-xl uppercase tracking-wide drop-shadow-md">La Casa de DAIS CHICKEN</h4>
            </div>
          </div>
        </div>

        {/* Mapa Interactivo */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-3xl shadow-sm p-4 h-full min-h-[300px] md:min-h-[500px] border border-gray-100 overflow-hidden relative">
            <iframe 
              src="https://www.google.com/maps?q=Roberto+Thorndike+Galup+1500,+Lima+15081&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '300px', borderRadius: '1rem' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Dais Chicken en Google Maps"
              className="md:min-h-[500px]"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
