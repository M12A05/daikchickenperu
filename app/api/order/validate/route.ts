import { NextResponse } from 'next/server';
import { isCatalogItemExpired } from '@/lib/catalog';
import { getCatalogState } from '@/lib/catalog-server';

const MAX_LINES = 50;
const MAX_QUANTITY = 99;
const MAX_BODY_BYTES = 16 * 1024;

type RawItem = { id?: unknown; quantity?: unknown };

function isRawItem(value: unknown): value is RawItem {
  return typeof value === 'object' && value !== null;
}

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: 'El pedido debe enviarse como JSON.' }, { status: 400 });
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'El pedido supera el tamaño máximo permitido.' }, { status: 400 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'El pedido no tiene un formato válido.' }, { status: 400 });
  }

  const rawItems = (body as { items?: unknown } | null)?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > MAX_LINES) {
    return NextResponse.json({ error: 'El pedido no contiene productos válidos.' }, { status: 400 });
  }

  const requested = new Map<number, number>();
  for (const value of rawItems) {
    if (!isRawItem(value) || !Number.isSafeInteger(value.id) || !Number.isSafeInteger(value.quantity)) {
      return NextResponse.json({ error: 'El pedido contiene cantidades inválidas.' }, { status: 400 });
    }

    const id = value.id as number;
    const quantity = value.quantity as number;
    const nextQuantity = (requested.get(id) ?? 0) + quantity;
    if (id <= 0 || quantity < 1 || quantity > MAX_QUANTITY || nextQuantity > MAX_QUANTITY) {
      return NextResponse.json({ error: 'La cantidad solicitada no es válida.' }, { status: 400 });
    }
    requested.set(id, nextQuantity);
  }

  try {
    const result = await getCatalogState();
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }

    const lines = [];
    for (const [id, quantity] of requested) {
      const product = result.items.find((item) => item.id === id);
      if (!product || !product.is_active || isCatalogItemExpired(product)) {
        return NextResponse.json(
          { error: 'Uno o más productos ya no están disponibles.', unavailableIds: [id] },
          { status: 409, headers: { 'Cache-Control': 'no-store' } },
        );
      }

      const unitCents = Math.round(product.price * 100);
      lines.push({
        id: product.id,
        name: product.name,
        price: unitCents / 100,
        quantity,
        lineTotal: (unitCents * quantity) / 100,
      });
    }

    const totalCents = lines.reduce((sum, line) => sum + Math.round(line.lineTotal * 100), 0);
    return NextResponse.json(
      { lines, total: totalCents / 100 },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('Unexpected order validation error:', error);
    return NextResponse.json(
      { error: 'No se pudo validar el pedido.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
