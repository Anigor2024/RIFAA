import type { MetadataRoute } from 'next';
import { DEMO_PRODUCTS } from '@/data/products';
import { JOURNAL_STORIES } from '@/data/stories';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rifaa-ashy.vercel.app';

const staticRoutes = [
  '',
  '/women',
  '/men',
  '/kids',
  '/new',
  '/collections',
  '/discover',
  '/atelier',
  '/compare',
  '/capsule',
  '/sale',
  '/editorial',
  '/about',
  '/shipping-returns',
  '/size-guide',
  '/faq',
  '/stores',
  '/sustainability',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1 : route.startsWith('/women') || route.startsWith('/men') || route.startsWith('/kids') ? 0.9 : 0.7,
    })),
    ...DEMO_PRODUCTS.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...JOURNAL_STORIES.map((story) => ({
      url: `${siteUrl}/editorial/${story.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
