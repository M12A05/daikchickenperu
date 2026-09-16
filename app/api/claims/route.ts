import { NextResponse } from 'next/server';
import { isValidDni, normalizeMultiline, normalizeSingleLine } from '@/lib/validation';
import { getTodayInLima, isValidDateOnly } from '@/lib/date';
import { SITE_URL } from '@/lib/siteConfig';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = { startedAt: number; count: number };
const rateLimit = new Map<string, RateLimitEntry>();

class RequestBodyTooLargeError extends Error {}

function jsonError(error: string, status: 400 | 403 | 429 | 503, field?: string, headers?: HeadersInit) {
  return NextResponse.json(
    { error, ...(field ? { field } : {}) },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentLength = request.headers.get('content-length');
  if (contentLength !== null) {
    const parsedLength = Number(contentLength);
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0 || parsedLength > MAX_BODY_BYTES) {
      throw new RequestBodyTooLargeError();
    }
  }

  if (!request.body) throw new Error('empty request body');

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return (forwarded || request.headers.get('x-real-ip')?.trim() || 'unknown').slice(0, 100);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const previous = rateLimit.get(ip);
  if (!previous || now - previous.startedAt >= RATE_LIMIT_WINDOW_MS) {
    if (rateLimit.size >= 10_000) {
      for (const [key, value] of rateLimit) {
        if (now - value.startedAt >= RATE_LIMIT_WINDOW_MS) rateLimit.delete(key);
      }
      if (rateLimit.size >= 10_000) {
        const oldestKey = rateLimit.keys().next().value;
        if (typeof oldestKey === 'string') rateLimit.delete(oldestKey);
      }
    }
    rateLimit.set(ip, { startedAt: now, count: 1 });
    return false;
  }

  previous.count += 1;
  return previous.count > RATE_LIMIT_MAX_REQUESTS;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readText(body: Record<string, unknown>, field: string, maxLength: number, multiline = false): string {
  const value = body[field];
  if (typeof value !== 'string') throw { field, message: 'El campo es obligatorio y debe ser texto.' };
  const normalized = multiline
    ? normalizeMultiline(value, maxLength + 1)
    : normalizeSingleLine(value, maxLength + 1);
  if (!normalized || normalized.length > maxLength) {
    throw { field, message: 'El campo está vacío o supera la longitud permitida.' };
  }
  return normalized;
}

function readOptionalText(body: Record<string, unknown>, field: string, maxLength: number, multiline = false): string {
  const value = body[field];
  if (value === undefined) return '';
  if (typeof value !== 'string') throw { field, message: 'El campo debe ser texto.' };
  const normalized = multiline
    ? normalizeMultiline(value, maxLength + 1)
    : normalizeSingleLine(value, maxLength + 1);
  if (normalized.length > maxLength) throw { field, message: 'El campo supera la longitud permitida.' };
  return normalized;
}

function isFutureDateOnly(value: string): boolean {
  return value > getTodayInLima();
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== SITE_URL && process.env.NODE_ENV === 'production') {
    return jsonError('Origen de solicitud no permitido.', 403);
  }

  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    return jsonError('El formulario debe enviarse como JSON.', 400);
  }

  if (isRateLimited(getClientIp(request))) {
    return jsonError(
      'Se alcanzó el límite temporal de registros. Inténtalo nuevamente más tarde.',
      429,
      undefined,
      { 'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) },
    );
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return jsonError('El formulario supera el tamaño máximo permitido.', 400);
    }
    return jsonError('El formulario no tiene un formato JSON válido.', 400);
  }

  if (!isRecord(body)) return jsonError('El formulario no tiene un formato válido.', 400);

  try {
    const name = readText(body, 'name', 100);
    const dni = readOptionalText(body, 'dni', 8);
    const type = body.type;
    if (type !== 'Reclamo' && type !== 'Queja') {
      throw { field: 'type', message: 'Selecciona Reclamo o Queja.' };
    }
    if (dni && !isValidDni(dni)) throw { field: 'dni', message: 'El DNI debe contener exactamente 8 dígitos.' };

    const email = readText(body, 'email', 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      throw { field: 'email', message: 'Ingresa un correo electrónico válido.' };
    }

    const phone = readText(body, 'phone', 30);
    if (!/^[0-9+()\- ]{7,30}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
      throw { field: 'phone', message: 'Ingresa un teléfono válido.' };
    }
    const address = readText(body, 'address', 180);
    const productService = readText(body, 'productService', 160);
    const incidentDate = readOptionalText(body, 'incidentDate', 10);
    if (incidentDate && (!isValidDateOnly(incidentDate) || isFutureDateOnly(incidentDate))) {
      throw { field: 'incidentDate', message: 'La fecha del hecho no es válida o es futura.' };
    }
    const description = readText(body, 'description', 2000, true);
    const consumerRequest = readText(body, 'request', 500, true);
    if (body.privacyAccepted !== true) {
      throw { field: 'privacy', message: 'Debes aceptar la política de privacidad.' };
    }

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScMV-VPMdcj596Z7cJvHbJnPOPENoTclx6PEDPt3-e_MhI4PQ/formResponse';
    const formData = new URLSearchParams();
    formData.append('entry.1283530443', name);
    formData.append('entry.348836267', dni || 'No especificado');
    formData.append('entry.1671862323', type);
    formData.append('entry.758374015', email);
    formData.append('entry.767492246', phone);
    formData.append('entry.176338134', address);
    formData.append('entry.1369385404', productService);
    formData.append('entry.1447463855', incidentDate || 'No especificada');
    formData.append('entry.1564595386', description);
    formData.append('entry.1535662814', consumerRequest);

    const gfResponse = await fetch(formUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!gfResponse.ok) {
      console.error('Google Forms submission failed:', gfResponse.status);
      return jsonError('No se pudo guardar el reclamo. Inténtalo nuevamente más tarde.', 503);
    }

    const mockClaimNumber = `REC-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    return NextResponse.json(
      { claimNumber: mockClaimNumber, createdAt: now, status: 'submitted' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (isRecord(error) && typeof error.field === 'string' && typeof error.message === 'string') {
      return jsonError(error.message, 400, error.field);
    }
    console.error('Unexpected claim persistence error:', error);
    return jsonError('El servicio de reclamos no está disponible. Inténtalo nuevamente más tarde.', 503);
  }
}
