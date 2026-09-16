"use client";

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { PHONE_DISPLAY } from '@/lib/siteConfig';
import { isValidDni, normalizeMultiline, normalizeSingleLine } from '@/lib/validation';
import { WHATSAPP_URL } from '@/lib/whatsapp';
import { getTodayInLima, isValidDateOnly } from '@/lib/date';

type ClaimErrorField =
  | 'name'
  | 'dni'
  | 'email'
  | 'phone'
  | 'address'
  | 'productService'
  | 'incidentDate'
  | 'description'
  | 'request'
  | 'privacy';

type Confirmation = {
  claimNumber: string;
  createdAt: string;
};

const ERROR_FIELDS = new Set<ClaimErrorField>([
  'name',
  'dni',
  'email',
  'phone',
  'address',
  'productService',
  'incidentDate',
  'description',
  'request',
  'privacy',
]);

function isFutureDateOnly(value: string): boolean {
  return value > getTodayInLima();
}

function formatConfirmationDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeZone: 'America/Lima' }).format(date);
}

export default function LibroReclamacionesPage() {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [type, setType] = useState<'Reclamo' | 'Queja'>('Reclamo');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [productService, setProductService] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [request, setRequest] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [errorField, setErrorField] = useState<ClaimErrorField | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dniInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const productServiceInputRef = useRef<HTMLInputElement>(null);
  const incidentDateInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const requestInputRef = useRef<HTMLTextAreaElement>(null);
  const privacyInputRef = useRef<HTMLInputElement>(null);

  const clearError = (field: ClaimErrorField) => {
    if (errorField === field) {
      setErrorField(null);
      setSubmitStatus('');
    }
  };

  const showFieldError = (message: string, field: ClaimErrorField) => {
    setSubmitStatus(message);
    setErrorField(field);
    window.setTimeout(() => {
      const input = {
        name: nameInputRef,
        dni: dniInputRef,
        email: emailInputRef,
        phone: phoneInputRef,
        address: addressInputRef,
        productService: productServiceInputRef,
        incidentDate: incidentDateInputRef,
        description: descriptionInputRef,
        request: requestInputRef,
        privacy: privacyInputRef,
      }[field];
      input.current?.focus();
    }, 0);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanName = normalizeSingleLine(name, 101);
    const cleanDni = normalizeSingleLine(dni, 9);
    const cleanEmail = normalizeSingleLine(email, 255).toLowerCase();
    const cleanPhone = normalizeSingleLine(phone, 31);
    const cleanAddress = normalizeSingleLine(address, 181);
    const cleanProductService = normalizeSingleLine(productService, 161);
    const cleanIncidentDate = normalizeSingleLine(incidentDate, 12);
    const cleanDescription = normalizeMultiline(description, 2001);
    const cleanRequest = normalizeMultiline(request, 501);

    if (!cleanName || cleanName.length > 100) {
      showFieldError('Ingresa tu nombre completo (máximo 100 caracteres).', 'name');
      return;
    }
    if (cleanDni && (!isValidDni(cleanDni) || cleanDni.length > 8)) {
      showFieldError('El DNI debe contener exactamente 8 dígitos.', 'dni');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail) || cleanEmail.length > 254) {
      showFieldError('Ingresa un correo electrónico válido.', 'email');
      return;
    }
    if (!/^[0-9+()\- ]{7,30}$/.test(cleanPhone) || cleanPhone.length > 30) {
      showFieldError('Ingresa un teléfono válido.', 'phone');
      return;
    }
    if (!cleanAddress || cleanAddress.length > 180) {
      showFieldError('Ingresa tu dirección (máximo 180 caracteres).', 'address');
      return;
    }
    if (!cleanProductService || cleanProductService.length > 160) {
      showFieldError('Indica el producto o servicio relacionado.', 'productService');
      return;
    }
    if (cleanIncidentDate && (!isValidDateOnly(cleanIncidentDate) || isFutureDateOnly(cleanIncidentDate))) {
      showFieldError('La fecha del hecho no es válida o es futura.', 'incidentDate');
      return;
    }
    if (!cleanDescription || cleanDescription.length > 2000) {
      showFieldError('Describe el detalle (máximo 2000 caracteres).', 'description');
      return;
    }
    if (!cleanRequest || cleanRequest.length > 500) {
      showFieldError('Indica qué solución solicitas (máximo 500 caracteres).', 'request');
      return;
    }
    if (!privacyAccepted) {
      showFieldError('Lee y acepta la política de privacidad para continuar.', 'privacy');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Registrando tu reclamo o queja...');
    setErrorField(null);
    setConfirmation(null);

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          dni: cleanDni,
          type,
          email: cleanEmail,
          phone: cleanPhone,
          address: cleanAddress,
          productService: cleanProductService,
          incidentDate: cleanIncidentDate,
          description: cleanDescription,
          request: cleanRequest,
          privacyAccepted,
        }),
      });

      const result = await response.json().catch(() => ({})) as {
        error?: unknown;
        field?: unknown;
        claimNumber?: unknown;
        createdAt?: unknown;
      };

      if (!response.ok) {
        const field = typeof result.field === 'string' && ERROR_FIELDS.has(result.field as ClaimErrorField)
          ? result.field as ClaimErrorField
          : null;
        const message = typeof result.error === 'string'
          ? result.error
          : response.status === 429
            ? 'Alcanzaste el límite temporal de registros. Inténtalo más tarde.'
            : 'No se pudo registrar el reclamo. Inténtalo nuevamente.';
        if (field) showFieldError(message, field);
        else setSubmitStatus(message);
        return;
      }

      if (typeof result.claimNumber !== 'string' || typeof result.createdAt !== 'string') {
        setSubmitStatus('El registro no devolvió una constancia válida. Contáctanos para verificarlo.');
        return;
      }

      setConfirmation({ claimNumber: result.claimNumber, createdAt: result.createdAt });
      setSubmitStatus('Tu reclamo o queja fue registrado correctamente.');
    } catch {
      setSubmitStatus('No se pudo conectar con el servicio de reclamos. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
           Libro de Reclamaciones
         </h1>
         <p className="text-dais-red font-black mt-3 text-base md:text-lg relative z-10 uppercase tracking-widest">
           Dais Chicken
         </p>
       </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6 text-gray-700 leading-relaxed relative z-10">
        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-black text-xl uppercase text-dais-dark mb-4">Registro formal</h2>
          <p className="mb-4">
            Completa este formulario para registrar formalmente tu reclamo o queja. Recibirás un número de
            constancia y la fecha de registro al finalizar.
          </p>
          <p className="text-sm text-gray-600">
            Un <strong>Reclamo</strong> se presenta cuando consideras que no se cumplió lo ofrecido; una{' '}
            <strong>Queja</strong> se refiere a la insatisfacción sobre la atención o el servicio.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lr-name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Nombre completo *</label>
                 <input ref={nameInputRef} id="lr-name" type="text" value={name} onChange={(e) => { clearError('name'); setName(e.target.value); }} autoComplete="name" maxLength={101} required aria-invalid={errorField === 'name'} aria-describedby={errorField === 'name' ? 'claim-error-name' : undefined} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium" />
                 {errorField === 'name' && <p id="claim-error-name" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
              </div>
              <div>
                <label htmlFor="lr-dni" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">DNI / Documento (opcional)</label>
                 <input ref={dniInputRef} id="lr-dni" type="text" value={dni} onChange={(e) => { clearError('dni'); setDni(e.target.value.replace(/\D/g, '').slice(0, 8)); }} inputMode="numeric" maxLength={8} aria-invalid={errorField === 'dni'} aria-describedby={errorField === 'dni' ? 'claim-error-dni' : undefined} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium" />
                 {errorField === 'dni' && <p id="claim-error-dni" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
              </div>
            </div>

            <fieldset>
              <legend className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tipo *</legend>
              <div className="flex gap-2">
                {(['Reclamo', 'Queja'] as const).map((claimType) => (
                  <label key={claimType} className={`cursor-pointer px-4 py-2.5 rounded-lg border text-sm font-bold transition-colors focus-within:ring-4 focus-within:ring-dais-red/30 ${type === claimType ? 'bg-dais-red border-dais-red text-white' : 'border-gray-200 text-dais-dark hover:border-dais-red/40'}`}>
                    <input type="radio" name="lr-type" value={claimType} checked={type === claimType} onChange={() => setType(claimType)} className="sr-only" />
                    {claimType}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lr-email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Correo electrónico *</label>
                 <input ref={emailInputRef} id="lr-email" type="email" value={email} onChange={(e) => { clearError('email'); setEmail(e.target.value); }} autoComplete="email" maxLength={255} required aria-invalid={errorField === 'email'} aria-describedby={errorField === 'email' ? 'claim-error-email' : undefined} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium" />
                 {errorField === 'email' && <p id="claim-error-email" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
              </div>
              <div>
                <label htmlFor="lr-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Teléfono *</label>
                 <input ref={phoneInputRef} id="lr-phone" type="tel" value={phone} onChange={(e) => { clearError('phone'); setPhone(e.target.value); }} autoComplete="tel" maxLength={30} required aria-invalid={errorField === 'phone'} aria-describedby={errorField === 'phone' ? 'claim-error-phone' : undefined} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium" />
                 {errorField === 'phone' && <p id="claim-error-phone" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="lr-address" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Dirección *</label>
               <input ref={addressInputRef} id="lr-address" type="text" value={address} onChange={(e) => { clearError('address'); setAddress(e.target.value); }} autoComplete="street-address" maxLength={181} required aria-invalid={errorField === 'address'} aria-describedby={errorField === 'address' ? 'claim-error-address' : undefined} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium" />
               {errorField === 'address' && <p id="claim-error-address" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lr-product-service" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Producto o servicio *</label>
                 <input ref={productServiceInputRef} id="lr-product-service" type="text" value={productService} onChange={(e) => { clearError('productService'); setProductService(e.target.value); }} maxLength={161} required aria-invalid={errorField === 'productService'} aria-describedby={errorField === 'productService' ? 'claim-error-product-service' : undefined} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium" />
                 {errorField === 'productService' && <p id="claim-error-product-service" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
              </div>
              <div>
                <label htmlFor="lr-incident-date" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Fecha del hecho (opcional)</label>
                 <input ref={incidentDateInputRef} id="lr-incident-date" type="date" value={incidentDate} onChange={(e) => { clearError('incidentDate'); setIncidentDate(e.target.value); }} max={getTodayInLima()} aria-invalid={errorField === 'incidentDate'} aria-describedby={errorField === 'incidentDate' ? 'claim-error-incident-date' : undefined} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium" />
                 {errorField === 'incidentDate' && <p id="claim-error-incident-date" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="lr-description" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Detalle del {type.toLowerCase()} *</label>
               <textarea ref={descriptionInputRef} id="lr-description" value={description} onChange={(e) => { clearError('description'); setDescription(e.target.value); }} maxLength={2001} required aria-invalid={errorField === 'description'} aria-describedby={errorField === 'description' ? 'claim-error-description' : undefined} rows={5} placeholder="Describe lo ocurrido con el mayor detalle posible..." className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium resize-y" />
               {errorField === 'description' && <p id="claim-error-description" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
            </div>

            <div>
              <label htmlFor="lr-request" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pedido del consumidor *</label>
               <textarea ref={requestInputRef} id="lr-request" value={request} onChange={(e) => { clearError('request'); setRequest(e.target.value); }} maxLength={501} required aria-invalid={errorField === 'request'} aria-describedby={errorField === 'request' ? 'claim-error-request' : undefined} rows={3} placeholder="¿Qué solución solicitas?" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium resize-y" />
               {errorField === 'request' && <p id="claim-error-request" role="alert" className="mt-1 text-xs font-medium text-red-700">{submitStatus}</p>}
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-600">
               <input ref={privacyInputRef} type="checkbox" checked={privacyAccepted} required aria-invalid={errorField === 'privacy'} aria-describedby={errorField === 'privacy' ? 'claim-error-privacy' : undefined} onChange={(e) => { clearError('privacy'); setPrivacyAccepted(e.target.checked); }} className="mt-0.5 accent-dais-red" />
              <span>
                He leído la{' '}
                <Link href="/politica-privacidad" className="font-bold text-dais-red underline">política de privacidad</Link>{' '}
                y autorizo el almacenamiento y uso de los datos para atender este reclamo o queja. *
              </span>
            </label>
            {errorField === 'privacy' && <p role="alert" className="-mt-3 text-xs font-medium text-red-700">{submitStatus}</p>}

             <button type="submit" disabled={isSubmitting} className="w-full min-h-12 bg-dais-red hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-black text-lg py-4 rounded-xl text-center uppercase tracking-widest shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/50">
              {isSubmitting ? 'Registrando...' : 'Registrar reclamo o queja'}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Tu registro queda almacenado para su atención. También puedes contactarnos por WhatsApp al{' '}
              <strong>{PHONE_DISPLAY}</strong>.
            </p>

            {submitStatus && !errorField && <p role="status" aria-live="polite" className="text-sm text-center font-medium text-dais-dark">{submitStatus}</p>}

            {confirmation && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center text-green-950" role="status" aria-live="polite">
                <h2 className="font-black uppercase tracking-wide">Constancia registrada</h2>
                <p className="mt-2">Número: <strong>{confirmation.claimNumber}</strong></p>
                <p>Fecha de registro: <strong>{formatConfirmationDate(confirmation.createdAt)}</strong></p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-bold text-dais-red underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/30">
                  Contactar por WhatsApp
                </a>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
