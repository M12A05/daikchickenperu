import type { MetadataRoute } from 'next'
import { IS_INDEXABLE, SITE_URL } from '@/lib/siteConfig'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_INDEXABLE
      ? [{ userAgent: '*', allow: '/' }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: IS_INDEXABLE ? `${SITE_URL}/sitemap.xml` : undefined,
  }
}
