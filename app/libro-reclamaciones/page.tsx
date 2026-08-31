"use client";

import { useState } from 'react';
import { WHATSAPP_NUMBER, PHONE_DISPLAY } from '@/lib/siteConfig';

export default function LibroReclamacionesPage() {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [type, setType] = useState<'Reclamo' | 'Queja'>('Reclamo');
  const [description, setDescription] = useState('');
  const [request, setRequest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let message = `*LIBRO DE RECLAMACIONES - Dais Chicken*\n\n`;
    message += `*Tipo:* ${type}\n`;
    message += `*Nombre:* ${name.trim() || 'No indicado'}\n`;
    if (dni.trim()) message += `*N° Documento:* ${dni.trim()}\n`;
    message += `*Detalle del ${type.toLowerCase()}:*\n${description.trim()}\n\n`;
    if (request.trim()) message += `*Pedido del consumidor:* ${request.trim()}\n`;
    message += `\nAgradezco su atención.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-white pb-20">
      <div className="bg-white pt-40 pb-8 px-4 text-center relative">
        <h1 className="text-4xl md:text-6xl font-black text-dais-dark uppercase tracking-tighter relative z-10">
          Libro de Reclamaciones
        </h1>
        <p className="text-dais-red font-black mt-3 text-lg md:text-xl relative z-10 uppercase tracking-widest">
          Dais Chicken
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <h2 className="font-black text-2xl uppercase text-dais-dark mb-4">Libro de Reclamaciones</h2>
          <p className="mb-4">
            De acuerdo con la Ley N° 29571 (Código de Protección y Defensa del Consumidor), ponemos a tu
            disposición el Libro de Reclamaciones para registrar cualquier reclamo o queja sobre nuestros
            productos o servicios. Completa el formulario y será enviado a nuestro equipo a través de WhatsApp.
          </p>
          <p className="text-sm text-gray-400">
            Ten en cuenta: un <strong>Reclamo</strong> se presenta cuando consideras que no se cumplió lo ofrecido;
            una <strong>Queja</strong> se refiere a la insatisfacción sobre la atención o el servicio.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lr-name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Nombre completo *
                </label>
                <input
                  id="lr-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
                />
              </div>
              <div>
                <label htmlFor="lr-dni" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  DNI / Documento
                </label>
                <input
                  id="lr-dni"
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
                />
              </div>
            </div>

            <div>
              <p className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tipo *</p>
              <div className="flex gap-2">
                {(['Reclamo', 'Queja'] as const).map((t) => (
                  <label
                    key={t}
                    className={`cursor-pointer px-4 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
                      type === t
                        ? 'bg-dais-red border-dais-red text-white'
                        : 'border-gray-200 text-dais-dark hover:border-dais-red/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="lr-type"
                      value={t}
                      checked={type === t}
                      onChange={() => setType(t)}
                      className="sr-only"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="lr-description" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                Detalle del {type.toLowerCase()} *
              </label>
              <textarea
                id="lr-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe el detalle de tu reclamo o queja..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium resize-y"
              />
            </div>

            <div>
              <label htmlFor="lr-request" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                Pedido del consumidor
              </label>
              <input
                id="lr-request"
                type="text"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="¿Qué solución esperas?"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-black text-lg py-4 rounded-xl text-center uppercase tracking-widest shadow-lg transition-colors"
            >
              Enviar por WhatsApp
            </button>
            <p className="text-sm text-gray-400 text-center">
              Al enviar abrirás WhatsApp con el detalle de tu reclamación. También puedes llamarnos al{' '}
              <strong>{PHONE_DISPLAY}</strong>.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}
