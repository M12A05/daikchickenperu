import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { isValidDni, isValidRuc, normalizeMultiline, normalizeSingleLine } from '@/lib/validation';
import { escapeWhatsAppText } from '@/lib/whatsapp';
import { isCatalogRow, isSafeCatalogImage, isValidCatalogDate } from '@/lib/catalog-validation';
import { isCatalogItemExpired } from '@/lib/catalog';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { isValidDateOnly } from '@/lib/date';

const require = createRequire(import.meta.url);
const { validateCatalog } = require('../scripts/generate-seed.cjs') as {
  validateCatalog: (catalog: unknown) => unknown;
};
const catalogData = require('../scripts/catalog-data.json') as unknown;

const validCatalogRow = () => ({
  id: 101,
  type: 'product' as const,
  name: 'Pollo a la brasa',
  description: 'Pollo entero con papas.',
  price: '64.00',
  image: '/carta menu/pollo.webp',
  category: 'Pollos a la Leña',
  original_price: null,
  badge: null,
  savings: null,
  expires_at: null,
  sort_order: 1,
  is_active: true,
  featured: true,
  updated_at: '2026-09-11T00:00:00.000Z',
});

describe('validation helpers', () => {
  it('normalizes control, directional and repeated whitespace characters', () => {
    expect(normalizeSingleLine('  José\u200B  Pérez\n Lima  ', 50)).toBe('José Pérez Lima');
    expect(normalizeMultiline(' Línea 1\r\nLínea 2\u202E ', 50)).toBe('Línea 1\nLínea 2');
  });

  it('validates DNI format', () => {
    expect(isValidDni('12345678')).toBe(true);
    expect(isValidDni('1234567')).toBe(false);
    expect(isValidDni('1234567A')).toBe(false);
  });

  it('validates RUC prefix and check digit', () => {
    expect(isValidRuc('20123456786')).toBe(true);
    expect(isValidRuc('20123456789')).toBe(false);
    expect(isValidRuc('99123456786')).toBe(false);
  });

  it('escapes WhatsApp formatting characters in user content', () => {
    expect(escapeWhatsAppText('*pedido* _urgente_')).toBe('\\*pedido\\* \\_urgente\\_');
  });

  it('accepts valid catalog rows and rejects non-finite or invalid optional values', () => {
    expect(isCatalogRow(validCatalogRow())).toBe(true);

    expect(isCatalogRow({ ...validCatalogRow(), price: Number.NaN })).toBe(false);
    expect(isCatalogRow({ ...validCatalogRow(), original_price: 'not-a-number' })).toBe(false);
    expect(isCatalogRow({ ...validCatalogRow(), original_price: 60 })).toBe(false);
    expect(isCatalogRow({ ...validCatalogRow(), expires_at: '2026-02-30T00:00:00Z' })).toBe(false);
    expect(isCatalogRow({ ...validCatalogRow(), updated_at: 'invalid-date' })).toBe(false);
    expect(isCatalogRow({ ...validCatalogRow(), name: ' ' })).toBe(false);
    expect(isCatalogRow({ ...validCatalogRow(), name: 'a'.repeat(161) })).toBe(false);
  });

  it('only permits root-relative local images or public Supabase storage URLs', () => {
    expect(isSafeCatalogImage('/carta menu/pollo.webp')).toBe(true);
    expect(isSafeCatalogImage('//externo.example/image.webp')).toBe(false);
    expect(isSafeCatalogImage('https://project.supabase.co/storage/v1/object/public/catalog/pollo.webp')).toBe(true);
    expect(isSafeCatalogImage('https://evil.example/storage/v1/object/public/catalog/pollo.webp')).toBe(false);
    expect(isSafeCatalogImage('javascript:alert(1)')).toBe(false);
  });

  it('validates catalog date strings without allowing normalized invalid dates', () => {
    expect(isValidCatalogDate('2026-09-11T00:00:00.000Z')).toBe(true);
    expect(isValidCatalogDate('2026-02-30T00:00:00Z')).toBe(false);
    expect(isValidCatalogDate('not-a-date')).toBe(false);
  });

  it('validates date-only claim values', () => {
    expect(isValidDateOnly('2026-09-14')).toBe(true);
    expect(isValidDateOnly('2026-02-30')).toBe(false);
    expect(isValidDateOnly('14-09-2026')).toBe(false);
  });

  it('treats catalog items at or past their expiration as unavailable', () => {
    const item = { expires_at: '2026-09-14T12:00:00.000Z' } as Parameters<typeof isCatalogItemExpired>[0];
    const expiration = Date.parse(item.expires_at as string);

    expect(isCatalogItemExpired(item, expiration - 1)).toBe(false);
    expect(isCatalogItemExpired(item, expiration)).toBe(true);
    expect(isCatalogItemExpired(item, expiration + 1)).toBe(true);
  });

  it('requires an HTTPS Supabase URL and a non-empty anon key', () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    try {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co/';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'public-key';
      expect(getSupabaseConfig()).toEqual({
        url: 'https://project.supabase.co/',
        anonKey: 'public-key',
      });

      for (const url of [
        'http://project.supabase.co',
        'https://example.com',
        'https://project.supabase.co.evil.example',
        'https://project.supabase.co/api',
      ]) {
        process.env.NEXT_PUBLIC_SUPABASE_URL = url;
        expect(() => getSupabaseConfig()).toThrow(/HTTPS Supabase URL/);
      }
    } finally {
      if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
      if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
    }
  });

  it('fails closed when seed data contains duplicates or unsafe values', () => {
    const seedItem = {
      ...validCatalogRow(),
      price: 64,
      original_price: undefined,
      expires_at: undefined,
      updated_at: undefined,
    };

    expect(() => validateCatalog([seedItem])).not.toThrow();
    expect(() => validateCatalog([{ ...seedItem, price: Number.NaN }])).toThrow(/finite money/);
    expect(() => validateCatalog([{ ...seedItem, image: '//externo.example/image.webp' }])).toThrow(/image URL/);
    expect(() => validateCatalog([seedItem, seedItem])).toThrow(/Duplicate catalog item id/);
  });

  it('accepts the checked-in seed catalog', () => {
    expect(() => validateCatalog(catalogData)).not.toThrow();
  });
});
