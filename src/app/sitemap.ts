import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { getAllCalculatorSlugs } from '@/calculators/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Base pages of our application
  const staticPages = [
    '',
    '/categories',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/search',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages for all locales
  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            ar: `${baseUrl}/ar${page}`,
          },
        },
      });
    });
  });

  // 2. Calculator detail pages for all locales
  const calculatorSlugs = getAllCalculatorSlugs();
  calculatorSlugs.forEach((slug) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/calculators/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/calculators/${slug}`,
            ar: `${baseUrl}/ar/calculators/${slug}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
