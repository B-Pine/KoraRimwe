import type { MetadataRoute } from 'next';
import { topics } from '@/data/topics';
import { signs } from '@/data/signs';
import { examBlueprints } from '@/data/exams';

const BASE = 'https://korarimwe.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/study', '/signs', '/practice', '/exams', '/revision', '/statistics'].map(
    (route) => ({
      url: `${BASE}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  return [
    ...staticRoutes,
    ...topics.map((topic) => ({
      url: `${BASE}/study/${topic.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...signs.map((sign) => ({
      url: `${BASE}/signs/${sign.id}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...examBlueprints.map((blueprint) => ({
      url: `${BASE}/exams/${blueprint.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
