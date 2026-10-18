import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

// Export locale-aware navigation helpers
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
