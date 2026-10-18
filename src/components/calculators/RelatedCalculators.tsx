'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getCalculatorBySlug } from '@/calculators/registry';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface RelatedCalculatorsProps {
  relatedSlugs: string[];
}

export default function RelatedCalculators({ relatedSlugs }: RelatedCalculatorsProps) {
  const t = useTranslations('calculator');
  const tGlobal = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (!relatedSlugs || relatedSlugs.length === 0) return null;

  // Resolve slug configurations
  const relatedCalcs = relatedSlugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((config) => !!config);

  if (relatedCalcs.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-text flex items-center gap-2">
        <span className="w-1.5 h-5 bg-primary rounded-full inline-block"></span>
        {t('relatedCalculators')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedCalcs.map((calc) => {
          if (!calc) return null;
          const title = tGlobal(`${calc.translationNamespace}.title`);
          const desc = tGlobal(`${calc.translationNamespace}.description`);

          return (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="card card-interactive p-5 bg-surface flex flex-col justify-between gap-3 group border border-border rounded-lg"
            >
              <div>
                <h3 className="font-bold text-base text-text group-hover:text-primary transition-colors mb-1">
                  {title}
                </h3>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-primary gap-1 self-start">
                <span>{isRtl ? 'فتح الحاسبة' : 'Open Calculator'}</span>
                <ArrowIcon className="h-3.5 w-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
