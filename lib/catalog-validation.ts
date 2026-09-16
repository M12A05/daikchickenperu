import type { CatalogItem } from './catalog';

export const CATALOG_LIMITS = {
  name: 160,
  description: 2000,
  image: 2048,
  category: 80,
  badge: 80,
  savings: 80,
} as const;

export type CatalogRow = {
  id: number;
  type: CatalogItem['type'];
  name: string;
  description: string;
  price: number | string;
  image: string;
  category: string | null;
  original_price: number | string | null;
  badge: string | null;
  savings: string | null;
  expires_at: string | null;
  sort_order: number;
  is_active: boolean;
  featured: boolean;
  updated_at: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string' || value.trim() === '') return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidCatalogDate(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 64) {
    return false;
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return false;

  // Date.parse normalizes impossible days such as February 30th.
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T ])/.exec(value);
  if (!dateParts) return false;

  const [, year, month, day] = dateParts;
  const normalized = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return (
    normalized.getUTCFullYear() === Number(year) &&
    normalized.getUTCMonth() === Number(month) - 1 &&
    normalized.getUTCDate() === Number(day)
  );
}

export function isSafeCatalogImage(value: unknown): value is string {
  if (
    typeof value !== 'string' ||
    value.length < 2 ||
    value.length > CATALOG_LIMITS.image ||
    /[\u0000-\u001f\u007f\\]/.test(value)
  ) {
    return false;
  }

  if (value.startsWith('/')) {
    return !value.startsWith('//') && !value.includes('://');
  }

  if (!value.startsWith('https://')) return false;

  try {
    const imageUrl = new URL(value);
    const hostname = imageUrl.hostname.toLowerCase();
    return (
      !imageUrl.username &&
      !imageUrl.password &&
      hostname !== 'supabase.co' &&
      hostname.endsWith('.supabase.co') &&
      imageUrl.pathname.startsWith('/storage/v1/object/public/') &&
      imageUrl.pathname.length > '/storage/v1/object/public/'.length
    );
  } catch {
    return false;
  }
}

function hasValidText(value: unknown, maxLength: number, required = false): value is string {
  if (typeof value !== 'string' || value.length > maxLength) return false;
  return !required || value.trim().length > 0;
}

function hasValidNullableText(value: unknown, maxLength: number): value is string | null | undefined {
  return value == null || hasValidText(value, maxLength);
}

function hasValidNullableDate(value: unknown): value is string | null | undefined {
  return value == null || isValidCatalogDate(value);
}

export function isCatalogRow(value: unknown): value is CatalogRow {
  if (!isRecord(value)) return false;

  const id = value.id;
  const price = parseFiniteNumber(value.price);
  const originalPrice = parseFiniteNumber(value.original_price);
  const sortOrder = value.sort_order;

  return (
    Number.isSafeInteger(id) &&
    typeof id === 'number' &&
    id > 0 &&
    (value.type === 'product' || value.type === 'promo') &&
    hasValidText(value.name, CATALOG_LIMITS.name, true) &&
    hasValidText(value.description, CATALOG_LIMITS.description) &&
    price !== null &&
    price >= 0 &&
    price <= 99999999.99 &&
    isSafeCatalogImage(value.image) &&
    hasValidNullableText(value.category, CATALOG_LIMITS.category) &&
    (value.original_price == null || (originalPrice !== null && originalPrice >= price)) &&
    hasValidNullableText(value.badge, CATALOG_LIMITS.badge) &&
    hasValidNullableText(value.savings, CATALOG_LIMITS.savings) &&
    hasValidNullableDate(value.expires_at) &&
    Number.isSafeInteger(sortOrder) &&
    typeof sortOrder === 'number' &&
    sortOrder >= 0 &&
    typeof value.is_active === 'boolean' &&
    typeof value.featured === 'boolean' &&
    hasValidNullableDate(value.updated_at)
  );
}

export function mapCatalogRow(row: CatalogRow): CatalogItem {
  const price = parseFiniteNumber(row.price);
  const originalPrice = row.original_price == null ? null : parseFiniteNumber(row.original_price);

  if (price === null || (row.original_price != null && originalPrice === null)) {
    throw new Error('Catalog row contains a non-finite price.');
  }

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    description: row.description,
    price,
    image: row.image,
    category: row.category ?? undefined,
    original_price: originalPrice ?? undefined,
    badge: row.badge ?? undefined,
    savings: row.savings ?? undefined,
    expires_at: row.expires_at ?? undefined,
    sort_order: row.sort_order,
    is_active: row.is_active,
    featured: row.featured,
    updated_at: row.updated_at ?? undefined,
  };
}
