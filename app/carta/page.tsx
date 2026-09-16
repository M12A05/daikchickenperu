import type { Metadata } from 'next'
import { headers } from 'next/headers'
import CartaClient from '@/components/CartaClient'
import { getCatalogState } from '@/lib/catalog-server'
import { SITE_NAME, SITE_URL, SITE_OG_IMAGE } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Nuestra Carta',
  description: 'Explora el menú completo de Dais Chicken: pollos a la leña, pechugas, parrillas, anticuchos, criollos, pastas, alitas y bebidas. Pide directo por WhatsApp.',
  alternates: {
    canonical: `${SITE_URL}/carta`,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: SITE_NAME,
    title: 'Nuestra Carta | Dais Chicken',
    description: 'Explora el menú completo de Dais Chicken: pollos a la leña, pechugas, parrillas, anticuchos y más.',
    url: `${SITE_URL}/carta`,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: 'Carta de Dais Chicken' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuestra Carta | Dais Chicken',
    description: 'Explora la carta de Dais Chicken y coordina tu pedido por WhatsApp.',
    images: [SITE_OG_IMAGE],
  },
}

export default async function CartaPage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  const { items, error } = await getCatalogState()
  const PRODUCTS = items.filter((product) => product.type === 'product')

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Carta de Dais Chicken',
    itemListElement: PRODUCTS.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: new URL(product.image, SITE_URL).toString(),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PEN',
          price: product.price.toFixed(2),
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/carta#producto-${product.id}`,
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }}
      />
      <CartaClient products={PRODUCTS} catalogError={error} />
    </>
  )
}
