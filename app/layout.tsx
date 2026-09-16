import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientOverlays from '@/components/ClientOverlays'
import { IS_INDEXABLE, SITE_NAME, SITE_URL, SITE_OG_IMAGE, SITE_DESCRIPTION } from '@/lib/siteConfig'
import { RESTAURANT_JSON_LD } from '@/lib/restaurantSchema'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | El Verdadero Sabor`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['pollo a la brasa', 'restaurante Lima', 'delivery pollo', 'Dais Chicken', 'parrilla', 'anticuchos', 'Lima Peru'],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} | El Verdadero Sabor`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Dais Chicken - Pollo a la brasa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | El Verdadero Sabor`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: IS_INDEXABLE,
    follow: IS_INDEXABLE,
    googleBot: {
      index: IS_INDEXABLE,
      follow: IS_INDEXABLE,
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
  return (
    <html lang="es" className="scroll-smooth">
      <head>
         <script
           type="application/ld+json"
           dangerouslySetInnerHTML={{ __html: RESTAURANT_JSON_LD }}
         />
      </head>
     <body className={`${inter.className}`}>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[200] -translate-y-20 rounded-lg bg-dais-red px-4 py-3 font-bold text-white transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
         <Navbar />
         <main id="main-content" className="min-h-screen min-h-dvh">
           {children}
         </main>
         <ClientOverlays />
        <Footer />
      </body>
    </html>
  )
}
