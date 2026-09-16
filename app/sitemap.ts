import type { MetadataRoute } from 'next'
import { IS_INDEXABLE, SITE_URL } from '@/lib/siteConfig'
import { getCatalog } from '@/lib/catalog-server'

const FALLBACK_CONTENT_UPDATE = new Date('2026-09-11T00:00:00.000Z')
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!IS_INDEXABLE) return [];

  const catalog = await getCatalog()
  const catalogDates = catalog
    .map((item) => item.updated_at ? Date.parse(item.updated_at) : Number.NaN)
    .filter((value) => !Number.isNaN(value))
  const lastModified = catalogDates.length > 0
    ? new Date(Math.max(...catalogDates))
    : FALLBACK_CONTENT_UPDATE

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/carta`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/promociones`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ubicacion`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/politica-privacidad`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
