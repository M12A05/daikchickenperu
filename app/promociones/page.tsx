import type { Metadata } from 'next';
import { headers } from 'next/headers';
import PromocionesClient from '@/components/PromocionesClient';
import { getCatalogState } from '@/lib/catalog-server';
import { isCatalogItemExpired } from '@/lib/catalog';
import { SITE_NAME, SITE_URL, SITE_OG_IMAGE } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Promociones',
  description: 'Descubre las promociones y combos de Dais Chicken: pollo a la brasa, parrillas, alitas y más en Lima.',
  alternates: {
    canonical: `${SITE_URL}/promociones`,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: SITE_NAME,
    title: 'Promociones | Dais Chicken',
    description: 'Aprovecha las promociones y combos de Dais Chicken en Lima.',
    url: `${SITE_URL}/promociones`,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: 'Promociones de Dais Chicken' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promociones | Dais Chicken',
    description: 'Conoce las promociones vigentes de Dais Chicken en Lima.',
    images: [SITE_OG_IMAGE],
  },
};

export default async function PromocionesPage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const { items, error } = await getCatalogState();
  const PROMOS = items.filter((promo) => promo.type === 'promo' && !isCatalogItemExpired(promo));

  const offersJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Promociones de Dais Chicken',
    itemListElement: PROMOS.map((promo, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: promo.name,
        description: promo.description,
        image: new URL(promo.image, SITE_URL).toString(),
        offers: {
          '@type': 'Offer',
           priceCurrency: 'PEN',
           price: promo.price.toFixed(2),
           availability: 'https://schema.org/InStock',
           ...(promo.expires_at ? { validThrough: promo.expires_at } : {}),
           url: `${SITE_URL}/promociones#promocion-${promo.id}`,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd).replace(/</g, '\\u003c') }}
      />
      <PromocionesClient promos={PROMOS} catalogError={error} />
    </>
  );
}
