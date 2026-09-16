import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { isCatalogItemExpired, type CatalogItem } from './catalog';
import { isCatalogRow, mapCatalogRow } from './catalog-validation';
import { getSupabaseConfig } from './supabase/config';

export type CatalogResult = {
  items: CatalogItem[];
  error: string | null;
};

const CATALOG_COLUMNS = [
  'id',
  'type',
  'name',
  'description',
  'price',
  'image',
  'category',
  'original_price',
  'badge',
  'savings',
  'expires_at',
  'sort_order',
  'is_active',
  'featured',
  'updated_at',
].join(',');

const catalogCacheKey = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'missing-supabase-project';

const getCachedCatalog = unstable_cache(
  async (): Promise<CatalogItem[]> => {
    const { url, anonKey } = getSupabaseConfig();

    const supabase = createSupabaseClient(url, anonKey, {
      global: {
        fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }),
      },
    });
    const { data, error } = await supabase
      .from('catalog_items')
      .select(CATALOG_COLUMNS)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Catalog fetch failed: ${error.message}`);
    }

    const rows = (data as unknown as unknown[] | null) ?? [];
    const validRows = rows.filter(isCatalogRow);

    if (rows.length > 0 && validRows.length === 0) {
      throw new Error('Catalog data did not match the expected schema.');
    }

    if (validRows.length !== rows.length) {
      console.warn(`Skipped ${rows.length - validRows.length} invalid catalog rows.`);
    }

    return validRows.map(mapCatalogRow).filter((item) => !isCatalogItemExpired(item));
  },
  ['catalog-items', catalogCacheKey],
  { revalidate: 300, tags: ['catalog'] },
);

export async function getCatalog(): Promise<CatalogItem[]> {
  try {
    return await getCachedCatalog();
  } catch (error) {
    console.error('Catalog unavailable:', error);
    return [];
  }
}

export async function getCatalogState(): Promise<CatalogResult> {
  try {
    return { items: await getCachedCatalog(), error: null };
  } catch (error) {
    console.error('Catalog unavailable:', error);
    const message = error instanceof Error && error.message.includes('Missing')
      ? 'No se configuró el catálogo.'
      : 'No se pudo cargar el catálogo.';
    return { items: [], error: message };
  }
}

export async function getProducts(): Promise<CatalogItem[]> {
  const catalog = await getCatalog();
  return catalog.filter(item => item.type === 'product');
}

export async function getPromos(): Promise<CatalogItem[]> {
  const catalog = await getCatalog();
  return catalog.filter((item) => item.type === 'promo' && !isCatalogItemExpired(item));
}
