import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RESTAURANT_JSON_LD } from '@/lib/restaurantSchema';

async function getInlineSchemaHash(): Promise<string> {
  const data = new TextEncoder().encode(RESTAURANT_JSON_LD);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function buildContentSecurityPolicy(nonce: string, schemaHash: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const scriptSources = [`'self'`, `'nonce-${nonce}'`, `'sha256-${schemaHash}'`, `'strict-dynamic'`];
  const supabaseOrigin = (() => {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
      return `${url.protocol}//${url.host}`;
    } catch {
      return 'https://*.supabase.co';
    }
  })();
  const connectSources = [`'self'`, supabaseOrigin];

  if (isDevelopment) {
    scriptSources.push(`'unsafe-eval'`);
    connectSources.push('ws:', 'http://localhost:*', 'https://localhost:*');
  }

  const policies = [
    `default-src 'self'`,
    `script-src ${scriptSources.join(' ')}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: ${supabaseOrigin}`,
    `font-src 'self'`,
    `connect-src ${connectSources.join(' ')}`,
    `frame-src https://www.google.com https://maps.google.com`,
    `media-src 'self'`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ];

  if (!isDevelopment) {
    policies.push('upgrade-insecure-requests');
  }

  return policies.join('; ');
}

export async function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce, await getInlineSchemaHash());
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
