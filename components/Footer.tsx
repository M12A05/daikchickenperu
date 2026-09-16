import Link from 'next/link';
import { MapPin, Phone, Clock, Facebook, Instagram } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_DISPLAY, ADDRESS, SCHEDULE } from '@/lib/siteConfig';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-10 pb-5 px-6 md:px-12 border-t border-gray-800">
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
        
        {/* Marca y Redes Sociales */}
        <div>
          <div className="flex flex-col items-start leading-tight mb-4">
            <span className="font-serif font-black text-2xl tracking-widest">DAIS</span>
            <span className="font-serif font-black text-2xl tracking-widest">CHICKEN</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            El verdadero sabor de la brasa con un toque único. Experiencia que te queda en cada bocado.
          </p>
          <div className="flex space-x-3 items-center">
              <a href="https://www.instagram.com/daischicken/" target="_blank" rel="noopener noreferrer" className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-[#E1306C] transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
             </a>
              <a href="https://www.facebook.com/DaisChicken/" target="_blank" rel="noopener noreferrer" className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-[#1877F2] transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
             </a>
              <a href="https://www.tiktok.com/@daischicken" target="_blank" rel="noopener noreferrer" className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                 <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.79-5.45-.29-2.06.28-4.22 1.57-5.83 1.25-1.55 3.12-2.52 5.09-2.73.18-.02.37-.03.56-.04V10c-1.31.06-2.6.43-3.7 1.15-1.35.88-2.28 2.31-2.52 3.9-.22 1.48.09 3.04 1.05 4.19 1.12 1.34 2.89 2.01 4.6 1.83 1.93-.19 3.6-1.57 4.18-3.42.17-.55.22-1.13.22-1.7V0h2.51z"/>
               </svg>
             </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-[#25D366] transition-colors" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
             </a>
          </div>
        </div>

        {/* Enlaces Rápidos */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Enlaces Rápidos</h3>
          <ul className="space-y-1 text-gray-400">
            <li><Link href="/" className="block py-2 hover:text-dais-red transition-colors">Inicio</Link></li>
            <li><Link href="/carta" className="block py-2 hover:text-dais-red transition-colors">Nuestra carta</Link></li>
            <li><Link href="/promociones" className="block py-2 hover:text-dais-red transition-colors">Promociones</Link></li>
            <li><Link href="/ubicacion" className="block py-2 hover:text-dais-red transition-colors">Ubicación</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Legal</h3>
          <ul className="space-y-1 text-gray-400">
            <li><Link href="/politica-privacidad" className="block py-2 hover:text-dais-red transition-colors">Política de Privacidad</Link></li>
            <li><Link href="/linea-etica" className="block py-2 hover:text-dais-red transition-colors">Línea Ética</Link></li>
            <li><Link href="/libro-reclamaciones" className="block py-2 hover:text-dais-red transition-colors">Libro Reclamaciones</Link></li>
          </ul>
        </div>

        {/* Contacto y Ubicación */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Visítanos</h3>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-dais-red flex-shrink-0 mt-1" aria-hidden="true" />
              <span>{ADDRESS}</span>
            </li>
             <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-dais-red flex-shrink-0" aria-hidden="true" />
               <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                 {PHONE_DISPLAY}
               </a>
             </li>
            <li className="flex items-center space-x-3">
               <Clock className="w-5 h-5 text-dais-red flex-shrink-0" aria-hidden="true" />
               <span>{SCHEDULE}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
        <p>&copy; {new Date().getFullYear()} Dais Chicken. Todos los derechos reservados.</p>
        <p>
          Hecho por <span className="text-white font-semibold tracking-wide">iamastudio</span>
        </p>
      </div>
    </footer>
  );
}
