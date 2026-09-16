function validateSupabaseUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL.');
  }

  const url = rawUrl.trim();
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const isSupabaseHost = hostname !== 'supabase.co' && hostname.endsWith('.supabase.co');

    if (
      parsedUrl.protocol !== 'https:' ||
      !isSupabaseHost ||
      Boolean(parsedUrl.username || parsedUrl.password) ||
      Boolean(parsedUrl.port) ||
      parsedUrl.pathname !== '/' ||
      parsedUrl.search ||
      parsedUrl.hash
    ) {
      throw new Error('invalid Supabase URL');
    }
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be an HTTPS Supabase URL.');
  }

  return url;
}

function validateSecretKey(rawKey: unknown): string {
  if (typeof rawKey !== 'string' || !rawKey.trim() || /[\u0000-\u001f\u007f\s]/.test(rawKey)) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY on the server.');
  }
  return rawKey.trim();
}

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (typeof rawAnonKey !== 'string') {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const url = validateSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = rawAnonKey.trim();
  if (!anonKey || /[\u0000-\u001f\u007f\s]/.test(anonKey)) {
    throw new Error('Supabase URL and anon key must be non-empty values.');
  }

  return { url, anonKey };
}

export function getSupabaseServiceRoleConfig(): { url: string; serviceRoleKey: string } {
  return {
    url: validateSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRoleKey: validateSecretKey(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}
