export const SITE_NAME = 'Dais Chicken';
const DEFAULT_SITE_URL = 'https://daischicken.com.pe';
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? vercelUrl ?? DEFAULT_SITE_URL;

function normalizeSiteUrl(value: string): string {
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin without credentials or query parameters.');
  }
  return parsed.toString().replace(/\/$/, '');
}

export const SITE_URL = normalizeSiteUrl(configuredSiteUrl);
export const IS_INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === 'true'
  && process.env.NODE_ENV === 'production'
  && process.env.VERCEL_ENV !== 'preview';
export const SITE_OG_IMAGE = '/imagenes/imagenfondo.png';
export const SITE_DESCRIPTION = 'Pollo a la brasa y comida peruana en Lima. Revisa nuestra carta, arma tu pedido y coordínalo directamente por WhatsApp.';

export const WHATSAPP_NUMBER = '51988497350';

export const PHONE_DISPLAY = '988 497 350';

export const ADDRESS = 'Roberto Thorndike Galup 1500, Lima 15081, Perú';

export const SCHEDULE = 'Lunes a Domingo: 12:00 PM - 11:00 PM';

export const PAYMENT_METHODS = ['Yape', 'Plin', 'Efectivo', 'Tarjeta'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];
