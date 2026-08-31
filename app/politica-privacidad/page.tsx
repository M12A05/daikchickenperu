import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, PHONE_DISPLAY, ADDRESS } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de Privacidad de Dais Chicken. Conoce cómo tratamos tus datos personales al realizar pedidos y contactarnos.',
  alternates: {
    canonical: `${SITE_URL}/politica-privacidad`,
  },
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-white pb-20">
      <div className="bg-white pt-40 pb-8 px-4 text-center relative">
        <h1 className="text-4xl md:text-6xl font-black text-dais-dark uppercase tracking-tighter relative z-10">
          Política de Privacidad
        </h1>
        <p className="text-dais-red font-black mt-3 text-lg md:text-xl relative z-10 uppercase tracking-widest">
          {SITE_NAME}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">1. Introducción</h2>
          <p>
            En {SITE_NAME} respetamos tu privacidad y nos comprometemos a proteger los datos personales que
            compartes con nosotros. Esta política explica qué información recopilamos, cómo la usamos y los
            derechos que tienes sobre ella.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">2. Información que recopilamos</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Datos que nos proporcionas:</strong> tu nombre, dirección, número de teléfono y método de pago cuando realizas un pedido a través de WhatsApp.</li>
            <li><strong>Datos de navegación:</strong> información básica sobre cómo utilizas nuestro sitio web (páginas visitadas, tiempo de permanencia).</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">3. Uso de la información</h2>
          <p>Utilizamos tu información para:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Procesar y confirmar tus pedidos.</li>
            <li>Gestionar la entrega a la dirección indicada.</li>
            <li>Comunicarnos contigo sobre tu pedido.</li>
            <li>Mejorar nuestros productos y servicios.</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">4. Almacenamiento local (Carrito)</h2>
          <p>
            Para brindarte una mejor experiencia, guardamos el contenido de tu carrito de compras de forma local
            en tu navegador (localStorage). Esta información no se transmite a nuestros servidores y puedes
            eliminarla en cualquier momento desde la configuración de tu navegador.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">5. Compartición de información</h2>
          <p>
            No vendemos, alquilamos ni cedemos tu información personal a terceros. Los datos que nos compartes
            al realizar un pedido se transmiten únicamente para la gestión de tu pedido a través de WhatsApp.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">6. Tus derechos</h2>
          <p>
            De acuerdo con la Ley N° 29733 (Ley de Protección de Datos Personales del Perú), tienes derecho a
            acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales. Para ejercer estos
            derechos, contáctanos por WhatsApp al <strong>{PHONE_DISPLAY}</strong>.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">7. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política, escríbenos a través de WhatsApp al <strong>{PHONE_DISPLAY}</strong>.
            Nuestro local se encuentra en {ADDRESS}.
          </p>
          <p className="mt-4 text-sm text-gray-400">Última actualización: {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </section>
      </div>
    </div>
  )
}
