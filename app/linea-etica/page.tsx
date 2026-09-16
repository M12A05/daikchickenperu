import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, PHONE_DISPLAY, WHATSAPP_NUMBER } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Línea Ética',
  description: 'Línea Ética de Dais Chicken. Canal de comunicación confidencial para reportar conductas contrarias a nuestros valores.',
  alternates: {
    canonical: `${SITE_URL}/linea-etica`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function LineaEticaPage() {
  const ethicsUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <div className="relative pb-16 bg-transparent z-0">
      <div 
        className="absolute inset-0 z-[-1] opacity-80 bg-fixed bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/fondodelpolloblanco.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[-1] bg-white/40 pointer-events-none" aria-hidden="true" />
      
      <div className="bg-gradient-to-b from-white/90 via-white/70 to-transparent pt-[calc(7rem+env(safe-area-inset-top))] pb-6 px-4 text-center relative">
        <h1 className="text-3xl md:text-5xl font-black text-dais-dark uppercase tracking-tighter relative z-10">
          Línea Ética
        </h1>
        <p className="text-dais-red font-black mt-3 text-base md:text-lg relative z-10 uppercase tracking-widest">
          {SITE_NAME}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6 text-gray-700 leading-relaxed relative z-10">
        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-black text-xl uppercase text-dais-dark mb-4">¿Qué es la Línea Ética?</h2>
          <p>
            La Línea Ética es un canal de comunicación confidencial de {SITE_NAME} que permite a nuestros
            clientes, colaboradores y proveedores reportar de forma segura cualquier situación que contravenga
            nuestros valores, la ley o nuestras políticas internas.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-black text-xl uppercase text-dais-dark mb-4">¿Qué se puede reportar?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Conductas deshonestas o fraudulentas.</li>
            <li>Discriminación o acoso.</li>
            <li>Incumplimiento de normas sanitarias o de seguridad alimentaria.</li>
            <li>Cualquier otra conducta que vulnere la ética o la ley.</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-black text-xl uppercase text-dais-dark mb-4">Confidencialidad</h2>
          <p>
             Trataremos tu reporte con seriedad y respeto. Como este canal utiliza WhatsApp, no podemos garantizar
             anonimato o confidencialidad absoluta frente a la plataforma de WhatsApp ni frente a los datos que
             decidas compartir. Evita incluir información innecesaria.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-black text-xl uppercase text-dais-dark mb-4">¿Cómo reportar?</h2>
          <p className="mb-6">
             Puedes reportar cualquier situación haciendo clic en el botón de abajo, lo que abrirá una conversación
             por WhatsApp con nuestro equipo. Escribe únicamente la información necesaria para atender tu reporte:
          </p>
          <a
            href={ethicsUrl}
            target="_blank"
            rel="noopener noreferrer"
             className="inline-block w-full bg-[#075E54] hover:bg-[#064c44] text-white font-black text-lg py-4 rounded-xl text-center uppercase tracking-widest shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]"
          >
            Reportar por WhatsApp
          </a>
           <p className="mt-4 text-sm text-gray-600">
            Alternativamente, comunícate al <strong>{PHONE_DISPLAY}</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}
