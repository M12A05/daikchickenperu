import { ADDRESS, SITE_NAME, SITE_OG_IMAGE, SITE_URL, WHATSAPP_NUMBER } from './siteConfig';

export const RESTAURANT_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: SITE_NAME,
  image: `${SITE_URL}${SITE_OG_IMAGE}`,
  logo: `${SITE_URL}/apple-icon`,
  '@id': `${SITE_URL}#restaurant`,
  url: SITE_URL,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS.split(',')[0],
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
  hasMap: `${SITE_URL}/ubicacion#mapa`,
  areaServed: { '@type': 'City', name: 'Lima' },
}).replace(/</g, '\\u003c');
