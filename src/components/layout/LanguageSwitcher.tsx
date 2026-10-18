'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      aria-label="Toggle language"
      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-md border border-border bg-surface text-text hover:bg-primary-light hover:text-primary transition duration-150 disabled:opacity-50 cursor-pointer"
    >
      {locale === 'ar' ? 'English (EN)' : 'العربية (AR)'}
    </button>
  );
}
