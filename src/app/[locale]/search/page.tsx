'use client';

import React, { useState, Suspense, use } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { getAllCalculators } from '@/calculators/registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AdSlot from '@/components/ads/AdSlot';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';

const allCalculators = getAllCalculators();

interface SearchPageContentProps {
  locale: string;
}

function SearchPageContent({ locale }: SearchPageContentProps) {
  const t = useTranslations('search');
  const tGlobal = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);

  // Perform instant real-time client-side filtering as the user types
  const results = query.trim()
    ? allCalculators.filter((calc) => {
        const title = tGlobal(`${calc.translationNamespace}.title`).toLowerCase();
        const desc = tGlobal(`${calc.translationNamespace}.description`).toLowerCase();
        
        let keywords: string[] = [];
        try {
          const keywordsRaw = tGlobal.raw(`${calc.translationNamespace}.keywords`);
          keywords = Array.isArray(keywordsRaw)
            ? keywordsRaw.map(k => String(k).toLowerCase())
            : [];
        } catch {
          // If keywords are missing in translation file
        }

        const searchQuery = query.toLowerCase().trim();
        return (
          title.includes(searchQuery) ||
          desc.includes(searchQuery) ||
          keywords.some((k) => k.includes(searchQuery))
        );
      })
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const renderIcon = (name?: string) => {
    if (!name) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5 text-primary" />;
  };

  const breadcrumbItems = [{ label: t('title') }];

  return (
    <div className="container-app py-8 space-y-8 max-w-4xl">
      <Breadcrumb items={breadcrumbItems} />

      <AdSlot position="header" />

      {/* Main Search Input Card */}
      <div className="card p-6 bg-surface space-y-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder={t('placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-surface text-text shadow focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light" />
        </form>
      </div>

      {/* Results or Suggestions */}
      {query.trim() ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text">
            {t('resultsFor', { query: query })}
          </h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results.map((calc) => {
                const title = tGlobal(`${calc.translationNamespace}.title`);
                const desc = tGlobal(`${calc.translationNamespace}.description`);

                return (
                  <Link
                    key={calc.slug}
                    href={`/calculators/${calc.slug}`}
                    className="card card-interactive p-6 bg-surface flex flex-col justify-between gap-4 border border-border rounded-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-primary-light rounded-lg border border-primary/10">
                        {renderIcon(calc.icon)}
                      </div>
                      <div className="space-y-1 flex-1">
                        <h3 className="font-bold text-base text-text">
                          {title}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                          {desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-xs font-bold text-primary gap-1 self-start">
                      <span>{tGlobal('common.calculate')}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-text-muted text-sm">{t('noResults')}</p>
              <div className="border-t border-border pt-8 mt-8 space-y-6">
                <h3 className="font-bold text-text">{t('suggestions')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-start">
                  {allCalculators.slice(0, 4).map((calc) => {
                    const title = tGlobal(`${calc.translationNamespace}.title`);
                    const desc = tGlobal(`${calc.translationNamespace}.description`);
                    return (
                      <Link
                        key={calc.slug}
                        href={`/calculators/${calc.slug}`}
                        className="card card-interactive p-5 bg-surface flex items-start gap-3 border border-border rounded-lg"
                      >
                        <div className="p-2 bg-primary-light rounded">{renderIcon(calc.icon)}</div>
                        <div>
                          <h4 className="font-bold text-sm text-text">{title}</h4>
                          <p className="text-xs text-text-muted line-clamp-1">{desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text">{t('suggestions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allCalculators.map((calc) => {
              const title = tGlobal(`${calc.translationNamespace}.title`);
              const desc = tGlobal(`${calc.translationNamespace}.description`);

              return (
                <Link
                  key={calc.slug}
                  href={`/calculators/${calc.slug}`}
                  className="card card-interactive p-6 bg-surface flex flex-col justify-between gap-4 border border-border rounded-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-primary-light rounded-lg border border-primary/10">
                      {renderIcon(calc.icon)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-bold text-base text-text">
                        {title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-xs font-bold text-primary gap-1 self-start">
                    <span>{tGlobal('common.calculate')}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <AdSlot position="footer" />
    </div>
  );
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function SearchPage({ params }: PageProps) {
  const { locale } = use(params);

  return (
    <Suspense fallback={<div className="container-app py-16 text-center text-text-muted">Loading...</div>}>
      <SearchPageContent locale={locale} />
    </Suspense>
  );
}
