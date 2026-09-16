'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
          <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }}>
          <div>
            <p style={{ color: '#c03333', fontSize: '4rem', fontWeight: 900, margin: 0 }}>Oops</p>
            <h1 style={{ color: '#111111' }}>Algo salió mal</h1>
            <p style={{ color: '#555555' }}>No pudimos cargar la página. Intenta nuevamente.</p>
            <button
              type="button"
              onClick={reset}
              style={{ background: '#c03333', border: 0, borderRadius: '0.75rem', color: 'white', cursor: 'pointer', fontWeight: 700, padding: '0.9rem 1.5rem' }}
            >
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
