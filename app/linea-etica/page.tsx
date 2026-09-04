import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, PHONE_DISPLAY, WHATSAPP_NUMBER } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Línea Ética',
  description: 'Línea Ética de Dais Chicken. Canal de comunicación confidencial para reportar conductas contrarias a nuestros valores.',
  alternates: {
    canonical: `${SITE_URL}/linea-etica`,
  },
}

export default function LineaEticaPage() {
  const ethicsMessage = encodeURIComponent(
    'Hola, deseo reportar una situación a través de la Línea Ética de Dais Chicken.'
  );
  const ethicsUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${ethicsMessage}`;

  return (
    <div className="bg-pattern pb-16">
      <div className="bg-white pt-28 pb-6 px-4 text-center relative">
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
            Garantizamos la confidencialidad de las denuncias presentadas. Puedes reportar de forma anónima si
            así lo prefieres. Todas las comunicaciones serán atendidas con seriedad y respeto.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-black text-xl uppercase text-dais-dark mb-4">¿Cómo reportar?</h2>
          <p className="mb-6">
            Puedes reportar cualquier situación haciendo clic en el botón de abajo, lo que abrirá una conversación
            por WhatsApp con nuestro equipo:
          </p>
          <a
            href={ethicsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-[#25D366] hover:bg-[#20b858] text-white font-black text-lg py-4 rounded-xl text-center uppercase tracking-widest shadow-lg transition-colors"
          >
            Reportar por WhatsApp
          </a>
          <p className="mt-4 text-sm text-gray-400">
            Alternativamente, comunícate al <strong>{PHONE_DISPLAY}</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}
