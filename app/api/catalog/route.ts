import { NextResponse } from 'next/server';
import { getCatalogState } from '@/lib/catalog-server';

export const revalidate = 300;

export async function GET() {
  try {
    const result = await getCatalogState();

    return NextResponse.json(result, {
      status: result.error ? 503 : 200,
      headers: {
        'Cache-Control': result.error
          ? 'no-store'
          : 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Unexpected catalog API error:', error);
    return NextResponse.json(
      { items: [], error: 'No se pudo cargar el catálogo.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
