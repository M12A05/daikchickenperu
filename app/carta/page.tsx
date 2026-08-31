import type { Metadata } from 'next'
import CartaClient from '@/components/CartaClient'

export const metadata: Metadata = {
  title: 'Nuestra Carta',
  description: 'Explora el menú completo de Dais Chicken: pollos a la leña, pechugas, parrillas, anticuchos, criollos, pastas, alitas y bebidas. Pide directo por WhatsApp.',
  alternates: {
    canonical: 'https://daischicken.com.pe/carta',
  },
  openGraph: {
    title: 'Nuestra Carta | Dais Chicken',
    description: 'Explora el menú completo de Dais Chicken: pollos a la leña, pechugas, parrillas, anticuchos y más.',
    url: 'https://daischicken.com.pe/carta',
  },
}

export default function CartaPage() {
  return <CartaClient />
}
