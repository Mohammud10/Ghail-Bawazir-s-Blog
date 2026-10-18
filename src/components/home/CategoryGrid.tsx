import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CATEGORIES } from '@/calculators/types';
import * as Icons from 'lucide-react';

export default function CategoryGrid() {
  const t = useTranslations('categories');

  // Helper to dynamically resolve Lucide icon components
  const renderIcon = (name: string, color: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return null;
    return <IconComponent className="h-6 w-6" style={{ color }} />;
  };

  return (
    <section className="py-12">
      <div className="container-app space-y-8">
        <div className="text-center md:text-start space-y-2">
          <h2 className="text-2xl font-extrabold text-text tracking-tight">
            {t('title')}
          </h2>
          <p className="text-sm text-text-muted">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.values(CATEGORIES).map((cat) => {
            const translation = t.raw(cat.slug);
            const name = translation?.name || cat.slug;
            const desc = translation?.description || '';

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="card card-interactive p-6 bg-surface flex flex-col items-center sm:items-start text-center sm:text-start gap-4 border border-border rounded-xl"
              >
                <div className="p-3 bg-slate-50 rounded-xl border border-border flex items-center justify-center">
                  {renderIcon(cat.icon, cat.color)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-text">
                    {name}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
