'use client';

import dynamic from 'next/dynamic';
import { lazy, Suspense } from 'react';
import { useCartStore } from '@/store/cartStore';

const WhatsAppFab = dynamic(() => import('@/components/WhatsAppFab'), { ssr: false });
const CartSidebar = lazy(() => import('@/components/CartSidebar'));

export default function ClientOverlays() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);

  return (
    <>
      <WhatsAppFab />
      {isCartOpen && (
        <Suspense fallback={null}>
          <CartSidebar />
        </Suspense>
      )}
    </>
  );
}
