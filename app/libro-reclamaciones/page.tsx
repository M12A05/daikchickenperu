import type { Metadata } from 'next';
import LibroReclamacionesClient from '@/components/LibroReclamacionesClient';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Canal de Reclamos y Quejas',
  description: 'Canal asistido de atención de reclamos y quejas de Dais Chicken.',
  alternates: {
    canonical: `${SITE_URL}/libro-reclamaciones`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LibroReclamacionesPage() {
  return <LibroReclamacionesClient />;
}
