'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getAllCalculators } from '@/calculators/registry';
import * as Icons from 'lucide-react';

export default function PopularCalculators() {
  const t = useTranslations('home');
  const tGlobal = useTranslations();

  const calculators = getAllCalculators();

  const renderIcon = (name?: string) => {
    if (!name) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5 text-primary" />;
  };

  return (
    <section className="py-12 border-t border-border bg-slate-50/50">
      <div className="container-app space-y-8">
        <div className="text-center md:text-start space-y-2">
          <h2 className="text-2xl font-extrabold text-text tracking-tight">
            {t('popularCalculators')}
          </h2>
          <p className="text-sm text-text-muted">
            {tGlobal('common.siteDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => {
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

                <div className="flex items-center text-xs font-bold text-primary gap-1 self-start hover:underline">
                  <span>{tGlobal('common.calculate')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
