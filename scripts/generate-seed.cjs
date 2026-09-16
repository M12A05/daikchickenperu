const fs = require('fs');
const path = require('path');

const LIMITS = {
  name: 160,
  description: 2000,
  image: 2048,
  category: 80,
  badge: 80,
  savings: 80,
};

function isValidDate(value) {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 64) return false;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return false;

  const dateParts = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T ])/.exec(value);
  if (!dateParts) return false;
  const [, year, month, day] = dateParts;
  const normalized = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return normalized.getUTCFullYear() === Number(year)
    && normalized.getUTCMonth() === Number(month) - 1
    && normalized.getUTCDate() === Number(day);
}

function isSafeImage(value) {
  if (typeof value !== 'string' || value.length < 2 || value.length > LIMITS.image) return false;
  if (/[\u0000-\u001f\u007f\\]/.test(value)) return false;
  if (value.startsWith('/')) return !value.startsWith('//') && !value.includes('://');
  if (!value.startsWith('https://')) return false;

  try {
    const imageUrl = new URL(value);
    const hostname = imageUrl.hostname.toLowerCase();
    return !imageUrl.username
      && !imageUrl.password
      && hostname !== 'supabase.co'
      && hostname.endsWith('.supabase.co')
      && imageUrl.pathname.startsWith('/storage/v1/object/public/')
      && imageUrl.pathname.length > '/storage/v1/object/public/'.length;
  } catch {
    return false;
  }
}

function isFiniteMoney(value) {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && value <= 99999999.99
    && /^\d+(?:\.\d{1,2})?$/.test(String(value));
}

function validateOptionalText(value, maxLength, field, index) {
  if (value == null) return;
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new Error(`Invalid catalog item at index ${index}: ${field} has an invalid length or type.`);
  }
}

function validateCatalogItem(item, index) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`Invalid catalog item at index ${index}.`);
  }
  if (!Number.isSafeInteger(item.id) || item.id <= 0) {
    throw new Error(`Invalid catalog item at index ${index}: id must be a positive safe integer.`);
  }
  if (item.type !== 'product' && item.type !== 'promo') {
    throw new Error(`Invalid catalog item at index ${index}: type is invalid.`);
  }
  if (typeof item.name !== 'string' || item.name.trim() === '' || item.name.length > LIMITS.name) {
    throw new Error(`Invalid catalog item at index ${index}: name is invalid.`);
  }
  if (typeof item.description !== 'string' || item.description.length > LIMITS.description) {
    throw new Error(`Invalid catalog item at index ${index}: description is invalid.`);
  }
  if (!isFiniteMoney(item.price)) {
    throw new Error(`Invalid catalog item at index ${index}: price must be finite money.`);
  }
  if (!isSafeImage(item.image)) {
    throw new Error(`Invalid catalog item at index ${index}: image URL is invalid.`);
  }
  if (item.original_price != null
    && (!isFiniteMoney(item.original_price) || item.original_price < item.price)) {
    throw new Error(`Invalid catalog item at index ${index}: original_price is invalid.`);
  }
  validateOptionalText(item.category, LIMITS.category, 'category', index);
  validateOptionalText(item.badge, LIMITS.badge, 'badge', index);
  validateOptionalText(item.savings, LIMITS.savings, 'savings', index);
  if (item.expires_at != null && !isValidDate(item.expires_at)) {
    throw new Error(`Invalid catalog item at index ${index}: expires_at is invalid.`);
  }
  if (!Number.isSafeInteger(item.sort_order) || item.sort_order < 0 || item.sort_order > 2147483647) {
    throw new Error(`Invalid catalog item at index ${index}: sort_order is invalid.`);
  }
  if (typeof item.is_active !== 'boolean' || typeof item.featured !== 'boolean') {
    throw new Error(`Invalid catalog item at index ${index}: flags must be boolean.`);
  }
}

function sqlString(value) {
  if (value === undefined || value === null) return 'null';
  if (typeof value !== 'string') throw new TypeError('SQL string values must be strings.');
  return `E'${value.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  if (value === undefined || value === null) return 'null';
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('SQL number values must be finite numbers.');
  }
  return Object.is(value, -0) ? '0' : String(value);
}

function validateCatalog(catalog) {
  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error('Catalog data must be a non-empty array.');
  }

  const ids = new Set();
  catalog.forEach((item, index) => {
    validateCatalogItem(item, index);
    if (ids.has(item.id)) throw new Error(`Duplicate catalog item id: ${item.id}.`);
    ids.add(item.id);
  });
  return catalog;
}

function generateSeed(catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'catalog-data.json'), 'utf8'),
)) {
  validateCatalog(catalog);

  const rows = catalog.map((item) => `(
  ${sqlNumber(item.id)},
  ${sqlString(item.type)},
  ${sqlString(item.name)},
  ${sqlString(item.description)},
  ${sqlNumber(item.price)},
  ${sqlString(item.image)},
  ${sqlString(item.category)},
  ${sqlNumber(item.original_price)},
  ${sqlString(item.badge)},
  ${sqlString(item.savings)},
  ${sqlString(item.expires_at)},
  ${sqlNumber(item.sort_order)},
  ${item.is_active ? 'true' : 'false'},
  ${item.featured ? 'true' : 'false'}
)`).join(',\n');

const sql = `insert into public.catalog_items (
  id, type, name, description, price, image, category,
  original_price, badge, savings, expires_at, sort_order, is_active, featured
) values
${rows}
on conflict (id) do update set
  type = excluded.type,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image = excluded.image,
  category = excluded.category,
  original_price = excluded.original_price,
  badge = excluded.badge,
  savings = excluded.savings,
  expires_at = excluded.expires_at,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  featured = excluded.featured,
  updated_at = timezone('utc', now());
 `;

  fs.writeFileSync(path.join(__dirname, '..', 'supabase', 'seed.sql'), sql);
  return sql;
}

if (require.main === module) {
  const sql = generateSeed();
  const rowCount = sql.match(/\n\s*\(/g)?.length ?? 0;
  console.log(`Generated ${rowCount} catalog rows.`);
}

module.exports = { generateSeed, isSafeImage, validateCatalog };
