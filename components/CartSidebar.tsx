"use client";
import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart, Maximize2, Minimize2, Receipt, FileText } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/siteConfig';
import { CatalogItem, isCatalogItemExpired } from '@/lib/catalog';
import { isValidDni, isValidRuc, normalizeSingleLine } from '@/lib/validation';
import { copyTextToClipboard, escapeWhatsAppText, openWhatsAppWithCopiedMessage, WHATSAPP_URL } from '@/lib/whatsapp';

type ViewMode = 'compact' | 'large';
type BillType = 'boleta' | 'factura';
type CheckoutStep = 'details' | 'confirm';
type OrderErrorField = 'name' | 'address' | 'privacy' | 'payment' | 'dni' | 'businessName' | 'ruc';
type CatalogResponse = { items: CatalogItem[]; error: string | null };
type ValidatedOrderLine = { id: number; name: string; price: number; quantity: number; lineTotal: number };
type ValidatedOrder = { lines: ValidatedOrderLine[]; total: number };

function isCatalogResponse(value: unknown): value is CatalogResponse {
  if (!value || typeof value !== 'object') return false;
  const response = value as { items?: unknown; error?: unknown };
  return Array.isArray(response.items) && (typeof response.error === 'string' || response.error === null);
}

async function fetchCatalog(signal: AbortSignal): Promise<CatalogResponse> {
  const response = await fetch('/api/catalog', {
    headers: { Accept: 'application/json' },
    cache: 'default',
    signal,
  });
  const payload: unknown = await response.json();

  if (!isCatalogResponse(payload)) {
    throw new Error('La respuesta del catálogo no es válida.');
  }

  return payload;
}

async function validateOrder(items: { id: number; quantity: number }[]): Promise<ValidatedOrder> {
  const response = await fetch('/api/order/validate', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const payload = await response.json() as Partial<ValidatedOrder> & { error?: string };
  if (!response.ok || !Array.isArray(payload.lines) || typeof payload.total !== 'number') {
    throw new Error(payload.error || 'No se pudo validar el pedido.');
  }
  return payload as ValidatedOrder;
}

export default function CartSidebar() {
  const { items, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('Yape');
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [billType, setBillType] = useState<BillType>('boleta');
  const [dni, setDni] = useState('');
  const [ruc, setRuc] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualMessage, setManualMessage] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('details');
  const [orderErrorField, setOrderErrorField] = useState<OrderErrorField | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const dniInputRef = useRef<HTMLInputElement>(null);
  const businessNameInputRef = useRef<HTMLInputElement>(null);
  const rucInputRef = useRef<HTMLInputElement>(null);
  const paymentInputRef = useRef<HTMLInputElement>(null);
  const privacyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCartOpen) return;

    let cancelled = false;
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (cancelled) return;
      setCatalogLoading(true);
      setCatalogError(null);
    });

    fetchCatalog(controller.signal)
      .then((result) => {
        if (cancelled) return;
        setCatalog(result.items);
        setCatalogError(result.error);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Error loading cart catalog:', error);
        setCatalog([]);
        setCatalogError('No se pudo cargar el catálogo. Inténtalo nuevamente.');
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [catalogAttempt, isCartOpen]);

  const showOrderError = (message: string, field: OrderErrorField) => {
    setOrderStatus(message);
    setOrderErrorField(field);
    window.setTimeout(() => {
      const input = {
        name: nameInputRef,
        address: addressInputRef,
        privacy: privacyInputRef,
       payment: paymentInputRef,
        dni: dniInputRef,
        businessName: businessNameInputRef,
        ruc: rucInputRef,
      }[field];
      input?.current?.focus();
    }, 0);
  };

  const catalogReady = !catalogLoading && !catalogError;
  const cartLines = catalogReady ? items.flatMap((item) => {
    const product = catalog.find(p => p.id === item.id);
    if (!product || isCatalogItemExpired(product)) return [];
    return [{ ...item, product }];
  }) : [];
  const unavailableItems = catalogReady ? items.filter((item) => {
    const product = catalog.find((candidate) => candidate.id === item.id);
    return !product || isCatalogItemExpired(product);
  }) : [];
  const total = cartLines.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalQuantity = cartLines.reduce((sum, item) => sum + item.quantity, 0);

  // Referencias y estados para el bucle suave del video
  const videoRef = useRef<HTMLVideoElement>(null);
  const cartPanelRef = useRef<HTMLDivElement>(null);
  const cartCloseRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  const clearOrderError = (field: OrderErrorField) => {
    if (orderErrorField === field) {
      setOrderErrorField(null);
      setOrderStatus('');
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) videoRef.current?.pause();
    };
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) videoRef.current?.pause();
  }, [reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Inicia el desvanecimiento (fade out) 0.6 segundos antes de que termine
      if (video.duration && video.duration - video.currentTime < 0.6) {
        setVideoOpacity(0);
      }
    };

    const handleEnded = () => {
      // Reinicia el video y lo vuelve a aparecer (fade in)
      video.currentTime = 0;
      if (!reducedMotion) void video.play().catch(() => undefined);
      setVideoOpacity(1);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isCartOpen, reducedMotion]);

  useEffect(() => {
    if (!isCartOpen) {
      const element = previousActiveElement.current;
      const isHidden = element?.closest('[aria-hidden="true"]') || element?.getAttribute('tabindex') === '-1';
      if (element?.isConnected && element !== document.body && !isHidden) {
        element.focus();
      }
      previousActiveElement.current = null;
      return;
    }

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    cartCloseRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleCart();
        return;
      }

      if (event.key !== 'Tab' || !cartPanelRef.current) return;

      const focusableElements = cartPanelRef.current.querySelectorAll<HTMLElement>(
         'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!cartPanelRef.current.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen, toggleCart]);

  useEffect(() => {
    if (isCartOpen && cartPanelRef.current && !cartPanelRef.current.contains(document.activeElement)) {
      cartCloseRef.current?.focus();
    }
  }, [cartLines.length, isCartOpen]);

  const validateDeliveryDetails = () => {
    const cleanName = normalizeSingleLine(name, 80);
    const cleanAddress = normalizeSingleLine(address, 180);

    if (!cleanName || !cleanAddress) {
      showOrderError('Ingresa tu nombre y dirección de entrega para continuar.', cleanName ? 'address' : 'name');
      return false;
    }

    return true;
  };

  const handleWhatsAppOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cartLines.length === 0) return;
    if (isSubmitting) return;

    if (checkoutStep === 'details') {
      if (!validateDeliveryDetails()) return;
      setOrderErrorField(null);
      setOrderStatus('');
      setCheckoutStep('confirm');
      window.setTimeout(() => paymentInputRef.current?.focus(), 0);
      return;
    }

    const cleanName = normalizeSingleLine(name, 80);
    const cleanAddress = normalizeSingleLine(address, 180);
    const cleanBusinessName = normalizeSingleLine(businessName, 120);
    const cleanDni = dni.trim();
    const cleanRuc = ruc.trim();

    if (!validateDeliveryDetails()) return;

    if (!privacyAccepted) {
      showOrderError('Lee y acepta la política de privacidad para continuar.', 'privacy');
      return;
    }

    if (!PAYMENT_METHODS.includes(payment)) {
      showOrderError('Selecciona un método de pago válido.', 'payment');
      return;
    }

    if (billType === 'boleta' && cleanDni && !isValidDni(cleanDni)) {
      showOrderError('El DNI debe contener exactamente 8 dígitos.', 'dni');
      return;
    }

    if (billType === 'factura' && !cleanBusinessName) {
      showOrderError('Para factura, ingresa la razón social.', 'businessName');
      return;
    }

    if (billType === 'factura' && !isValidRuc(cleanRuc)) {
      showOrderError('Ingresa un RUC válido de 11 dígitos.', 'ruc');
      return;
    }

    setIsSubmitting(true);
    let validatedOrder: ValidatedOrder;
    try {
      validatedOrder = await validateOrder(items);
    } catch (error) {
      setOrderStatus(error instanceof Error ? error.message : 'No se pudo validar el pedido. Inténtalo nuevamente.');
      setOrderErrorField(null);
      setIsSubmitting(false);
      return;
    }

    let message = `*¡Hola Dais Chicken!* ${String.fromCodePoint(0x1f357)} Quisiera realizar el siguiente pedido:\n\n`;
    validatedOrder.lines.forEach((item) => {
      message += `${String.fromCodePoint(0x2705)} ${item.quantity}x ${escapeWhatsAppText(item.name)} (S/ ${item.lineTotal.toFixed(2)})\n`;
    });
    message += `\n*Total a pagar: ${String.fromCodePoint(0x1f4b0)} S/ ${validatedOrder.total.toFixed(2)}*\n\n`;

    message += `*Nombre:* ${String.fromCodePoint(0x1f464)} ${escapeWhatsAppText(cleanName)}\n`;
    message += `*Dirección de entrega:* ${String.fromCodePoint(0x1f4cd)} ${escapeWhatsAppText(cleanAddress)}\n`;
    message += `*Método de pago:* ${String.fromCodePoint(0x1f4b3)} ${payment}\n`;
    
    // Datos de facturación
    if (billType === 'boleta') {
      message += `*Comprobante:* ${String.fromCodePoint(0x1f9fe)} Boleta`;
      if (cleanDni) message += ` (DNI: ${escapeWhatsAppText(cleanDni)})`;
      message += `\n`;
    } else {
      message += `*Comprobante:* ${String.fromCodePoint(0x1f9fe)} Factura\n`;
      message += `*Razón Social:* ${String.fromCodePoint(0x1f3e2)} ${escapeWhatsAppText(cleanBusinessName)}\n`;
      message += `*RUC:* ${String.fromCodePoint(0x1f4cb)} ${escapeWhatsAppText(cleanRuc)}\n`;
    }
    
    message += `\nPor favor, confírmenme el pedido. ¡Gracias! ${String.fromCodePoint(0x1f64c)}`;

    setManualMessage('');
    setOrderErrorField(null);
    try {
      const { opened, copied } = await openWhatsAppWithCopiedMessage(message);
      if (opened && copied) {
        setOrderStatus('WhatsApp se abrió. El mensaje fue copiado: pégalo en la conversación y confirma el pedido.');
      } else if (copied) {
        setOrderStatus('El mensaje fue copiado. Abre WhatsApp, pégalo en la conversación y confirma el pedido.');
      } else if (opened) {
        setManualMessage(message);
        setOrderStatus('WhatsApp se abrió, pero no se pudo copiar automáticamente. Copia el mensaje desde aquí.');
      } else {
        setManualMessage(message);
        setOrderStatus('El navegador bloqueó WhatsApp. Copia el mensaje y abre WhatsApp manualmente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay Oscuro */}
      <div 
         className="fixed inset-0 bg-black/60 z-[160] transition-opacity backdrop-blur-sm"
         onClick={(event) => {
           if (event.target === event.currentTarget) toggleCart();
         }}
        aria-hidden="true"
      />

      {/* Sidebar Carrito */}
      <div
        ref={cartPanelRef}
        id="cart-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
         className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[460px] bg-white z-[170] shadow-2xl flex flex-col overflow-y-auto sm:overflow-hidden animate-slide-in-right"
      >
        
        {/* Mascota asomándose (Video WEBM con mejora de color) */}
        <div className="absolute right-[82%] bottom-2 w-[450px] md:w-[650px] h-auto z-[-1] pointer-events-none hidden sm:block overflow-hidden">
          <video
            aria-hidden="true"
             ref={videoRef}
             src="/videointro.webm"
             poster="/dais.webp"
             autoPlay={!reducedMotion}
             muted
             playsInline
             preload="none"
            className="w-full h-auto object-contain drop-shadow-2xl saturate-150 contrast-125 -rotate-[8deg] transition-opacity duration-700 ease-in-out"
            style={{ 
              opacity: videoOpacity,
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 85%)'
            }}
          />
        </div>

        {/* Header */}
         <div className="sticky top-0 bg-dais-dark text-white p-5 pt-[calc(1.25rem+env(safe-area-inset-top))] flex justify-between items-center shadow-md z-10 relative sm:static">
           <h2 id="cart-title" className="font-black text-2xl uppercase tracking-wider">Tu Pedido</h2>
           <button
             ref={cartCloseRef}
            onClick={toggleCart}
             className="min-h-11 min-w-11 text-gray-300 hover:text-white transition-colors bg-white/10 p-2.5 rounded-full hover:bg-white/20"
            aria-label="Cerrar carrito"
          >
             <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Lista de Productos */}
         <div className="flex-none p-4 md:flex-1 md:min-h-0 md:overflow-y-auto md:p-5 space-y-3 custom-scrollbar bg-[#F8F9FA]">
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            Carrito actualizado: {totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'}.
          </p>
          {unavailableItems.length > 0 && (
            <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p>Algunos productos ya no están disponibles o vencieron y no se incluirán en el pedido.</p>
              <button
                type="button"
                onClick={() => unavailableItems.forEach((item) => removeFromCart(item.id))}
                className="mt-2 font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              >
                Quitar productos no disponibles
              </button>
            </div>
          )}
          {catalogLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500" role="status" aria-live="polite">
               <ShoppingCart className="w-20 h-20 mb-4 opacity-20 animate-pulse" aria-hidden="true" />
              <p className="font-bold text-xl uppercase tracking-widest text-center">Cargando catálogo...</p>
            </div>
          ) : catalogError ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-red-900" role="alert">
              <p className="font-bold text-xl uppercase tracking-widest">No podemos cargar tu pedido</p>
              <p className="mt-2 max-w-sm text-sm text-red-800">{catalogError}</p>
              <button
                type="button"
                onClick={() => setCatalogAttempt((attempt) => attempt + 1)}
                className="mt-5 rounded-xl bg-dais-red px-5 py-3 font-bold text-white hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/40"
              >
                Reintentar
              </button>
            </div>
          ) : cartLines.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <ShoppingCart className="w-20 h-20 mb-4 opacity-20" aria-hidden="true" />
              <p className="font-bold text-xl uppercase tracking-widest text-center">Tu canasta<br/>está vacía</p>
            </div>
          ) : (
            <>
              {/* Barra de control de vista */}
              <div className="flex items-center justify-between px-1 pb-1">
                   <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    <span role="status" aria-live="polite" aria-atomic="true">
                      {cartLines.length} {cartLines.length === 1 ? 'producto' : 'productos'}
                    </span>
                </p>
                 <div className="flex items-center gap-2">
                   <button
                     type="button"
                     onClick={() => clearCart()}
                     className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-dais-red"
                   >
                     Vaciar
                   </button>
                   <button
                     type="button"
                     onClick={() => setViewMode(m => m === 'compact' ? 'large' : 'compact')}
                     className="flex items-center gap-1.5 text-xs font-bold text-dais-red hover:text-red-800 uppercase tracking-wider bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                     aria-label={viewMode === 'compact' ? 'Ver productos más grandes' : 'Ver productos más compactos'}
                     title={viewMode === 'compact' ? 'Agrandar vista' : 'Compactar vista'}
                   >
                     {viewMode === 'compact' ? <Maximize2 className="w-4 h-4" aria-hidden="true" /> : <Minimize2 className="w-4 h-4" aria-hidden="true" />}
                     {viewMode === 'compact' ? 'Agrandar' : 'Compactar'}
                   </button>
                 </div>
              </div>

               {cartLines.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow flex ${
                    viewMode === 'large' ? 'p-3 gap-4' : 'p-4 gap-4'
                  }`}
                >
                  {/* Img */}
                  <div className={`bg-gray-100 rounded-xl overflow-hidden shrink-0 relative ${
                    viewMode === 'large' ? 'w-28 h-28' : 'w-20 h-20'
                  }`}>
                    <Image 
                       src={item.product.image}
                       alt={item.product.name}
                      fill 
                      sizes={viewMode === 'large' ? '112px' : '80px'} 
                      className="object-cover" 
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className={`${viewMode === 'large' ? 'pr-10' : 'pr-6'} min-w-0`}>
                      <h4 className={`font-bold text-dais-dark uppercase break-words ${
                        viewMode === 'large' ? 'text-base leading-snug' : 'text-sm leading-tight'
                      }`}>{item.product.name}</h4>
                      <p className={`text-dais-red font-black mt-1 ${
                        viewMode === 'large' ? 'text-lg' : 'text-sm'
                      }`}>S/ {(item.product.price * item.quantity).toFixed(2)}</p>
                      {viewMode === 'large' && (
                         <p className="text-xs text-gray-600 font-medium">S/ {item.product.price.toFixed(2)} c/u</p>
                      )}
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}
                         className="w-11 h-11 min-w-11 min-h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-dais-dark transition-colors"
                         aria-label={`Disminuir cantidad de ${item.product.name}`}
                      >
                        <Minus className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <span className="font-black text-center min-w-6">{item.quantity}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}
                         className="w-11 h-11 min-w-11 min-h-11 rounded-full bg-[#fce4c8] text-dais-red hover:bg-dais-red hover:text-white flex items-center justify-center transition-colors"
                         aria-label={`Aumentar cantidad de ${item.product.name}`}
                      >
                        <Plus className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Botón Borrar */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                     className="absolute top-3 right-2 min-h-11 min-w-11 p-2 text-gray-300 hover:text-dais-red transition-colors"
                    aria-label={`Eliminar ${item.product.name} del carrito`}
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>

                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer / Checkout */}
        {cartLines.length > 0 && (
          <form noValidate onSubmit={handleWhatsAppOrder} className="shrink-0 bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] relative z-10 custom-scrollbar overflow-visible md:overflow-y-auto md:max-h-[50vh]">
            <div className="mb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-dais-red">
                    Paso {checkoutStep === 'details' ? '1' : '2'} de 2
                  </p>
                  <h3 className="mt-1 text-xl font-black text-dais-dark">
                    {checkoutStep === 'details' ? '¿Dónde lo entregamos?' : 'Revisa tu pedido'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {checkoutStep === 'details'
                      ? 'Solo necesitamos estos datos para empezar.'
                      : 'Elige cómo pagar y confirma los datos finales.'}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[#fff4e8] px-3 py-1 text-xs font-black text-dais-red">
                  S/ {total.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 flex gap-2" aria-label={`Progreso del pedido: paso ${checkoutStep === 'details' ? '1' : '2'} de 2`}>
                <span className="h-1.5 flex-1 rounded-full bg-dais-red" />
                <span className={`h-1.5 flex-1 rounded-full ${checkoutStep === 'confirm' ? 'bg-dais-red' : 'bg-gray-200'}`} />
              </div>
            </div>

            {checkoutStep === 'details' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cart-name" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
                    Nombre
                  </label>
                  <input
                    ref={nameInputRef}
                    id="cart-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      clearOrderError('name');
                      setName(e.target.value.slice(0, 80));
                    }}
                    autoComplete="name"
                    maxLength={80}
                    required
                    aria-invalid={orderErrorField === 'name'}
                    aria-describedby={orderErrorField === 'name' ? 'order-error-name' : undefined}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-dais-dark font-medium focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20"
                  />
                  {orderErrorField === 'name' && <p id="order-error-name" role="alert" className="mt-1 text-xs font-medium text-red-700">{orderStatus}</p>}
                </div>
                <div>
                  <label htmlFor="cart-address" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
                    Dirección de entrega
                  </label>
                  <input
                    ref={addressInputRef}
                    id="cart-address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      clearOrderError('address');
                      setAddress(e.target.value.slice(0, 180));
                    }}
                    autoComplete="street-address"
                    maxLength={180}
                    required
                    aria-invalid={orderErrorField === 'address'}
                    aria-describedby={orderErrorField === 'address' ? 'order-error-address' : undefined}
                    placeholder="Av. Brasil 123"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-dais-dark font-medium focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20"
                  />
                  {orderErrorField === 'address' && <p id="order-error-address" role="alert" className="mt-1 text-xs font-medium text-red-700">{orderStatus}</p>}
                </div>
                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center rounded-xl bg-dais-red px-4 py-3.5 text-base font-black uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/40"
                >
                  Continuar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setOrderErrorField(null);
                    setOrderStatus('');
                    setCheckoutStep('details');
                    window.setTimeout(() => nameInputRef.current?.focus(), 0);
                  }}
                  className="text-sm font-bold text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-dais-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dais-red/30"
                >
                  Volver a datos de entrega
                </button>

                <div className="flex items-center justify-between rounded-xl border border-[#f5dcc2] bg-[#fffaf5] px-4 py-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">Tu pedido</p>
                    <p className="mt-1 text-sm font-medium text-dais-dark">{totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'}</p>
                  </div>
                  <span className="text-lg font-black text-dais-red">S/ {total.toFixed(2)}</span>
                </div>

                <fieldset className="rounded-xl border border-gray-100 p-3">
                  <legend className="px-1 text-xs font-bold uppercase tracking-widest text-gray-500">Método de pago</legend>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-bold transition-colors focus-within:ring-4 focus-within:ring-dais-red/30 ${
                          payment === method
                            ? 'border-dais-red bg-dais-red text-white'
                            : 'border-gray-200 text-dais-dark hover:border-dais-red/40'
                        }`}
                      >
                        <input
                          ref={method === PAYMENT_METHODS[0] ? paymentInputRef : undefined}
                          type="radio"
                          name="payment"
                          value={method}
                          checked={payment === method}
                          onChange={() => {
                            clearOrderError('payment');
                            setPayment(method);
                          }}
                          className="sr-only"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                  {orderErrorField === 'payment' && <p id="order-error-payment" role="alert" className="mt-1 text-xs font-medium text-red-700">{orderStatus}</p>}
                </fieldset>

                <fieldset className="rounded-xl border border-gray-100 p-3">
                  <legend className="px-1 text-xs font-bold uppercase tracking-widest text-gray-500">Comprobante</legend>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <label
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors focus-within:ring-4 focus-within:ring-dais-red/30 ${
                        billType === 'boleta'
                          ? 'border-dais-red bg-dais-red text-white'
                          : 'border-gray-200 text-dais-dark hover:border-dais-red/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bill"
                        value="boleta"
                        checked={billType === 'boleta'}
                        onChange={() => setBillType('boleta')}
                        className="sr-only"
                      />
                      <Receipt className="h-4 w-4" aria-hidden="true" /> Boleta
                    </label>
                    <label
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors focus-within:ring-4 focus-within:ring-dais-red/30 ${
                        billType === 'factura'
                          ? 'border-dais-red bg-dais-red text-white'
                          : 'border-gray-200 text-dais-dark hover:border-dais-red/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bill"
                        value="factura"
                        checked={billType === 'factura'}
                        onChange={() => setBillType('factura')}
                        className="sr-only"
                      />
                      <FileText className="h-4 w-4" aria-hidden="true" /> Factura
                    </label>
                  </div>

                  <div className="mt-3">
                    {billType === 'boleta' ? (
                      <>
                        <label htmlFor="cart-dni" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
                          DNI <span className="font-medium normal-case tracking-normal text-gray-400">(opcional)</span>
                        </label>
                        <input
                          ref={dniInputRef}
                          id="cart-dni"
                          type="text"
                          inputMode="numeric"
                          maxLength={8}
                          value={dni}
                          aria-invalid={orderErrorField === 'dni'}
                          aria-describedby={orderErrorField === 'dni' ? 'order-error-dni' : undefined}
                          onChange={(e) => {
                            clearOrderError('dni');
                            setDni(e.target.value.replace(/\D/g, '').slice(0, 8));
                          }}
                          placeholder="12345678"
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-dais-dark font-medium focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20"
                        />
                        {orderErrorField === 'dni' && <p id="order-error-dni" role="alert" className="mt-1 text-xs font-medium text-red-700">{orderStatus}</p>}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="cart-razon" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
                            Razón Social <span className="text-dais-red">*</span>
                          </label>
                          <input
                            ref={businessNameInputRef}
                            id="cart-razon"
                            type="text"
                            value={businessName}
                            onChange={(e) => {
                              clearOrderError('businessName');
                              setBusinessName(e.target.value.slice(0, 120));
                            }}
                            autoComplete="organization"
                            maxLength={120}
                            required
                            aria-invalid={orderErrorField === 'businessName'}
                            aria-describedby={orderErrorField === 'businessName' ? 'order-error-business-name' : undefined}
                            placeholder="Nombre de la empresa"
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-dais-dark font-medium focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20"
                          />
                          {orderErrorField === 'businessName' && <p id="order-error-business-name" role="alert" className="mt-1 text-xs font-medium text-red-700">{orderStatus}</p>}
                        </div>
                        <div>
                          <label htmlFor="cart-ruc" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
                            RUC <span className="text-dais-red">*</span>
                          </label>
                          <input
                            ref={rucInputRef}
                            id="cart-ruc"
                            type="text"
                            inputMode="numeric"
                            maxLength={11}
                            value={ruc}
                            onChange={(e) => {
                              clearOrderError('ruc');
                              setRuc(e.target.value.replace(/\D/g, '').slice(0, 11));
                            }}
                            required
                            aria-invalid={orderErrorField === 'ruc'}
                            aria-describedby={orderErrorField === 'ruc' ? 'order-error-ruc' : undefined}
                            placeholder="20123456789"
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-dais-dark font-medium focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20"
                          />
                          {orderErrorField === 'ruc' && <p id="order-error-ruc" role="alert" className="mt-1 text-xs font-medium text-red-700">{orderStatus}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </fieldset>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Total</span>
                  <span className="text-3xl font-black text-dais-dark">S/ {total.toFixed(2)}</span>
                </div>

                <label className="flex items-start gap-2 text-xs text-gray-600">
                  <input
                    ref={privacyInputRef}
                    type="checkbox"
                    checked={privacyAccepted}
                    aria-invalid={orderErrorField === 'privacy'}
                    aria-describedby={orderErrorField === 'privacy' ? 'order-error-privacy' : undefined}
                    onChange={(e) => {
                      clearOrderError('privacy');
                      setPrivacyAccepted(e.target.checked);
                    }}
                    className="mt-0.5 accent-dais-red"
                  />
                  <span>
                    He leído la{' '}
                    <Link href="/politica-privacidad" onClick={toggleCart} className="font-bold text-dais-red underline">
                      política de privacidad
                    </Link>{' '}
                    y autorizo el uso de los datos que decida enviar por WhatsApp.
                  </span>
                </label>
                {orderErrorField === 'privacy' && <p id="order-error-privacy" role="alert" className="-mt-2 text-xs font-medium text-red-700">{orderStatus}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#075E54] py-4 text-lg font-black uppercase tracking-widest text-white shadow-lg transition-colors duration-300 hover:bg-[#064c44] hover:shadow-xl hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
                >
                  {isSubmitting ? 'Preparando pedido...' : 'Continuar por WhatsApp'}
                </button>
                {orderStatus && !orderErrorField && (
                  <p id="order-status" role="status" aria-live="polite" className="text-center text-sm font-medium text-dais-dark">
                    {orderStatus}
                  </p>
                )}
                {manualMessage && (
                  <div className="space-y-2">
                    <label htmlFor="manual-order-message" className="block text-xs font-bold uppercase tracking-wide text-gray-600">Mensaje para WhatsApp</label>
                    <textarea id="manual-order-message" readOnly value={manualMessage} rows={8} className="w-full rounded-lg border border-gray-300 p-3 text-xs text-dais-dark" />
                    <button
                      type="button"
                      onClick={async () => setOrderStatus((await copyTextToClipboard(manualMessage)) ? 'Mensaje copiado. Pégalo en WhatsApp para confirmar.' : 'No se pudo copiar. Selecciona el mensaje manualmente.')}
                      className="w-full rounded-lg border border-dais-dark px-4 py-2 text-sm font-bold text-dais-dark hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/30"
                    >
                      Copiar mensaje nuevamente
                    </button>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-sm font-bold text-dais-red underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dais-red/30"
                    >
                      Abrir WhatsApp manualmente
                    </a>
                  </div>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
}
