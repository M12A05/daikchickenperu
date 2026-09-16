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
    <div className="relative pb-20 bg-transparent z-0">
      <div 
        className="absolute inset-0 z-[-1] opacity-80 bg-fixed bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/fondodelpolloblanco.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[-1] bg-white/40 pointer-events-none" aria-hidden="true" />
      
      <div className="bg-gradient-to-b from-white/90 via-white/70 to-transparent pt-[calc(7rem+env(safe-area-inset-top))] pb-8 px-4 text-center relative">
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
             <li><strong>Datos que decides enviar:</strong> nombre, dirección, teléfono, correo electrónico, método de pago, DNI, RUC, razón social y los datos que incluyas en consultas, reclamos o reportes.</li>
             <li><strong>Datos técnicos:</strong> información básica necesaria para entregar el sitio, como navegador, dispositivo, IP y registros técnicos del proveedor de hosting.</li>
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
             <li>Atender consultas, reclamos, quejas y reportes enviados mediante nuestros canales.</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">4. Almacenamiento local (Carrito)</h2>
          <p>
             Para brindarte una mejor experiencia, guardamos únicamente los identificadores de productos y sus
             cantidades de forma local en tu navegador (localStorage). Al continuar con un pedido, esos identificadores
             y cantidades se envían temporalmente al servidor para validar disponibilidad y precios antes de preparar el
             mensaje. Puedes eliminar el carrito en cualquier momento desde la configuración de tu navegador.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
           <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">5. Reclamos y quejas</h2>
           <p>
              Cuando completas el Libro de Reclamaciones, almacenamos en nuestra base de datos el nombre, DNI
              opcional, tipo de caso, correo, teléfono, dirección, producto o servicio, fecha del hecho, detalle,
              pedido y la aceptación de esta política. El sistema genera un número de constancia, un identificador
              técnico, la fecha de registro y un estado para dar seguimiento y atender el caso. Conservamos esta
              información durante el tiempo necesario para gestionar el reclamo y cumplir las obligaciones legales.
              El registro se realiza en el servidor y no requiere abrir ni enviar un mensaje por WhatsApp.
           </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
           <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">6. Compartición de información</h2>
           <p>
              No vendemos ni alquilamos tu información personal. Podemos utilizar proveedores de infraestructura,
              incluido Supabase, para almacenar y operar el servicio bajo las medidas correspondientes. WhatsApp y
              Meta son servicios independientes: solo intervienen si decides contactarnos por ese medio y aplican sus
              propias políticas de privacidad. El mapa de Google solo se carga después de que lo solicitas y está
              sujeto a las políticas de Google.
           </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
           <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">7. Tus derechos</h2>
           <p>
              De acuerdo con la Ley N° 29733 (Ley de Protección de Datos Personales del Perú), puedes solicitar
              acceso, rectificación, cancelación u oposición al tratamiento de tus datos. Escríbenos por WhatsApp al
              <strong> {PHONE_DISPLAY}</strong>. La solicitud debe permitir identificarte y especificar el derecho que deseas ejercer.
           </p>
         </section>

         <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
           <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">8. Contacto</h2>
           <p>
              Si tienes preguntas sobre esta política o tu constancia, escríbenos a través de WhatsApp al{' '}
              <strong>{PHONE_DISPLAY}</strong>. Nuestro local se encuentra en {ADDRESS}. Evita compartir información
              innecesaria y no envíes datos bancarios ni contraseñas.
           </p>
            <p className="mt-4 text-sm text-gray-600">Última actualización: 11 de septiembre de 2026</p>
        </section>
      </div>
    </div>
  )
}
