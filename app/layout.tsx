import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER, ADDRESS } from '@/lib/siteConfig'

const WhatsAppFab = dynamic(() => import('@/components/WhatsAppFab'), { ssr: false })
const CartSidebar = dynamic(() => import('@/components/CartSidebar'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | El Verdadero Sabor`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Sabor que prende, experiencia que te queda. Pide tu pollo a la brasa favorito directo a WhatsApp. Roberto Thorndike Galup 1500, Lima.',
  keywords: ['pollo a la brasa', 'restaurante Lima', 'delivery pollo', 'Dais Chicken', 'parrilla', 'anticuchos', 'Lima Peru'],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | El Verdadero Sabor`,
    description: 'Sabor que prende, experiencia que te queda. Pide tu pollo a la brasa favorito directo a WhatsApp.',
    images: [
      {
        url: '/dais-og.png',
        width: 1200,
        height: 630,
        alt: 'Dais Chicken - Pollo a la brasa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | El Verdadero Sabor`,
    description: 'Sabor que prende, experiencia que te queda. Pide tu pollo a la brasa favorito directo a WhatsApp.',
    images: ['/dais-og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE_NAME,
    image: '/dais-og.png',
    url: SITE_URL,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Roberto Thorndike Galup 1500',
      addressLocality: 'Lima',
      addressRegion: 'Lima',
      postalCode: '15081',
      addressCountry: 'PE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -12.08,
      longitude: -77.04,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '23:00',
    },
    servesCuisine: ['Peruvian', 'Pollo a la brasa', 'Parrilla'],
    priceRange: '$$',
    menu: `${SITE_URL}/carta`,
    acceptsReservations: 'true',
  }

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className}`}>
        <Navbar />
        <main className="min-h-screen min-h-dvh">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <CartSidebar />
      </body>
    </html>
  )
}
