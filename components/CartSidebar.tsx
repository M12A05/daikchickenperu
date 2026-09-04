"use client";
import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart, Maximize2, Minimize2, Receipt, FileText } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { WHATSAPP_NUMBER, PAYMENT_METHODS, type PaymentMethod } from '@/lib/siteConfig';

type ViewMode = 'compact' | 'large';
type BillType = 'boleta' | 'factura';

export default function CartSidebar() {
  const { items, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('Yape');
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [billType, setBillType] = useState<BillType>('boleta');
  const [dni, setDni] = useState('');
  const [ruc, setRuc] = useState('');
  const [businessName, setBusinessName] = useState('');

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Referencias y estados para el bucle suave del video
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(1);

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
      video.play();
      setVideoOpacity(1);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isCartOpen]);

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    
    let message = `*¡Hola Dais Chicken!* 🍗 Quisiera realizar el siguiente pedido:\n\n`;
    items.forEach(item => {
      message += `✅ ${item.quantity}x ${item.name} (S/ ${(item.price * item.quantity).toFixed(2)})\n`;
    });
    message += `\n*Total a pagar: S/ ${total.toFixed(2)}*\n\n`;
    
    if (name.trim()) {
      message += `*Nombre:* ${name.trim()}\n`;
    }
    if (address.trim()) {
      message += `*Dirección de entrega:* ${address.trim()}\n`;
    }
    message += `*Método de pago:* ${payment}\n`;
    
    // Datos de facturación
    if (billType === 'boleta') {
      message += `*Comprobante:* Boleta`;
      if (dni.trim()) message += ` (DNI: ${dni.trim()})`;
      message += `\n`;
    } else {
      message += `*Comprobante:* Factura\n`;
      if (businessName.trim()) message += `*Razón Social:* ${businessName.trim()}\n`;
      if (ruc.trim()) message += `*RUC:* ${ruc.trim()}\n`;
    }
    
    message += `\nPor favor, confírmenme el pedido. ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    clearCart();
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay Oscuro */}
      <div 
        className="fixed inset-0 bg-black/60 z-[100] transition-opacity backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Sidebar Carrito */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white z-[110] shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Mascota asomándose (Video WEBM con mejora de color) */}
        <div className="absolute right-[82%] bottom-2 w-[450px] md:w-[650px] h-auto z-[-1] pointer-events-none hidden sm:block overflow-hidden">
          <video 
            ref={videoRef}
            src="/videointro.webm" 
            autoPlay 
            muted 
            playsInline 
            preload="metadata"
            className="w-full h-auto object-contain drop-shadow-2xl saturate-150 contrast-125 -rotate-[8deg] transition-opacity duration-700 ease-in-out"
            style={{ 
              opacity: videoOpacity,
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 85%)'
            }}
          />
        </div>

        {/* Header */}
        <div className="bg-dais-dark text-white p-5 flex justify-between items-center shadow-md z-10 relative">
          <h2 className="font-black text-2xl uppercase tracking-wider">Tu Pedido</h2>
          <button 
            onClick={toggleCart}
            className="text-gray-300 hover:text-white transition-colors bg-white/10 p-2.5 rounded-full hover:bg-white/20"
            aria-label="Cerrar carrito"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar bg-[#F8F9FA]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-20 h-20 mb-4 opacity-20" />
              <p className="font-bold text-xl uppercase tracking-widest text-center">Tu canasta<br/>está vacía</p>
            </div>
          ) : (
            <>
              {/* Barra de control de vista */}
              <div className="flex items-center justify-between px-1 pb-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </p>
                <button
                  onClick={() => setViewMode(m => m === 'compact' ? 'large' : 'compact')}
                  className="flex items-center gap-1.5 text-xs font-bold text-dais-red hover:text-red-800 uppercase tracking-wider bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                  aria-label={viewMode === 'compact' ? 'Ver productos más grandes' : 'Ver productos más compactos'}
                  title={viewMode === 'compact' ? 'Agrandar vista' : 'Compactar vista'}
                >
                  {viewMode === 'compact' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  {viewMode === 'compact' ? 'Agrandar' : 'Compactar'}
                </button>
              </div>

              {items.map(item => (
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
                      src={item.image} 
                      alt={item.name} 
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
                      }`}>{item.name}</h4>
                      <p className={`text-dais-red font-black mt-1 ${
                        viewMode === 'large' ? 'text-lg' : 'text-sm'
                      }`}>S/ {(item.price * item.quantity).toFixed(2)}</p>
                      {viewMode === 'large' && item.price && (
                        <p className="text-xs text-gray-400 font-medium">S/ {item.price.toFixed(2)} c/u</p>
                      )}
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}
                        className="w-8 h-8 min-w-[36px] min-h-[36px] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-dais-dark transition-colors"
                        aria-label={`Disminuir cantidad de ${item.name}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-center min-w-6">{item.quantity}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}
                        className="w-8 h-8 min-w-[36px] min-h-[36px] rounded-full bg-[#fce4c8] text-dais-red hover:bg-dais-red hover:text-white flex items-center justify-center transition-colors"
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>

                  {/* Botón Borrar */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                    className="absolute top-3 right-2 p-2 text-gray-300 hover:text-dais-red transition-colors"
                    aria-label={`Eliminar ${item.name} del carrito`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="bg-white p-5 border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] relative z-10 custom-scrollbar overflow-y-auto max-h-[50vh]">
            {/* Datos del cliente */}
            <div className="space-y-3 mb-5">
              <div>
                <label htmlFor="cart-name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Nombre
                </label>
                <input
                  id="cart-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
                />
              </div>
              <div>
                <label htmlFor="cart-address" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Dirección de entrega
                </label>
                <input
                  id="cart-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={address ? '' : 'Av. Brasil 123'}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
                />
              </div>

              {/* Comprobante: Boleta / Factura */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Comprobante
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`cursor-pointer px-3 py-2.5 rounded-lg border text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                      billType === 'boleta'
                        ? 'bg-dais-red border-dais-red text-white'
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
                    <Receipt className="w-4 h-4" /> Boleta
                  </label>
                  <label
                    className={`cursor-pointer px-3 py-2.5 rounded-lg border text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                      billType === 'factura'
                        ? 'bg-dais-red border-dais-red text-white'
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
                    <FileText className="w-4 h-4" /> Factura
                  </label>
                </div>
              </div>

              {/* Campos según comprobante */}
              {billType === 'boleta' ? (
                <div>
                  <label htmlFor="cart-dni" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    DNI (opcional)
                  </label>
                  <input
                    id="cart-dni"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    placeholder="12345678"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="cart-razon" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Razón Social *
                    </label>
                    <input
                      id="cart-razon"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Nombre de la empresa"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="cart-ruc" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      RUC *
                    </label>
                    <input
                      id="cart-ruc"
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      value={ruc}
                      onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
                      placeholder="20123456789"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-dais-red focus:outline-none focus:ring-2 focus:ring-dais-red/20 text-dais-dark font-medium"
                    />
                  </div>
                </>
              )}

              <fieldset>
                <legend className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Método de pago
                </legend>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method}
                      className={`cursor-pointer px-3 py-2 rounded-lg border text-sm font-bold transition-colors ${
                        payment === method
                          ? 'bg-dais-red border-dais-red text-white'
                          : 'border-gray-200 text-dais-dark hover:border-dais-red/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={payment === method}
                        onChange={() => setPayment(method)}
                        className="sr-only"
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex justify-between items-center mb-5">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">Total:</span>
              <span className="font-black text-3xl text-dais-dark">S/ {total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-black text-lg py-4 rounded-xl flex items-center justify-center gap-3 transition-colors uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
            >
              Pedir por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
