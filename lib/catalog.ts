export interface CatalogItem {
  id: number;
  type: 'product' | 'promo';
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  original_price?: number;
  badge?: string;
  savings?: string;
  expires_at?: string;
  sort_order: number;
  is_active: boolean;
  featured: boolean;
  updated_at?: string;
}

export const CATEGORIES = [
  'Todos',
  'Pollos a la Leña',
  'Pechugas',
  'Ensaladas',
  'Parrillas',
  'Anticuchos',
  'Carnes',
  'Piqueos',
  'Alitas',
  'Criollos',
  'Pastas',
  'Bebidas',
] as const;

export function isCatalogItemExpired(item: CatalogItem, now = Date.now()): boolean {
  if (!item.expires_at) return false;
  const expiration = Date.parse(item.expires_at);
  return !Number.isFinite(expiration) || expiration <= now;
}
