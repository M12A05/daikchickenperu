const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_INDEXABLE',
  'SUPABASE_SERVICE_ROLE_KEY',
];

if (process.env.VERCEL_ENV !== 'production' && process.env.REQUIRE_PRODUCTION_CONFIG !== 'true') {
  process.exit(0);
}

const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length > 0) {
  console.error(`Missing production environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

if (!['true', 'false'].includes(process.env.NEXT_PUBLIC_INDEXABLE)) {
  console.error('NEXT_PUBLIC_INDEXABLE must be either true or false.');
  process.exit(1);
}

try {
  const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL);
  if (siteUrl.protocol !== 'https:' || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash) {
    throw new Error('invalid site URL');
  }
} catch {
  console.error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path or query.');
  process.exit(1);
}

console.log('Production environment configuration is valid.');
