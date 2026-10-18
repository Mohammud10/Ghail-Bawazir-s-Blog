'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { HelpCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="relative inline-flex items-center justify-center p-4 bg-primary-light text-primary rounded-full border border-primary/10 mb-4 animate-pulse-soft">
          <HelpCircle className="h-16 w-16" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-black text-white">404</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight leading-tight">
          {t('title')}
        </h1>
        
        <p className="text-sm md:text-base text-text-muted leading-relaxed">
          {t('description')}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-5 py-3 text-base font-bold text-white shadow transition cursor-pointer"
          >
            <Home className="h-5 w-5" />
            <span>{t('backHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
