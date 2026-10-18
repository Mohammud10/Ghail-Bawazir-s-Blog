import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { CATEGORIES } from '@/calculators/types';
import { getCalculatorsByCategory } from '@/calculators/registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AdSlot from '@/components/ads/AdSlot';
import * as Icons from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const cat = CATEGORIES[slug as keyof typeof CATEGORIES];
  if (!cat) return {};

  const t = await getTranslations({ locale, namespace: 'categories' });
  const translation = t.raw(cat.slug);

  return {
    title: translation?.name || cat.slug,
    description: translation?.description || '',
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cat = CATEGORIES[slug as keyof typeof CATEGORIES];
  if (!cat) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'categories' });
  const tGlobal = await getTranslations({ locale });
  const translation = t.raw(cat.slug);
  const name = translation?.name || cat.slug;
  const desc = translation?.description || '';

  // Get calculators registered under this category
  const calculators = getCalculatorsByCategory(cat.slug);

  const breadcrumbItems = [
    { label: t('title'), href: '/categories' },
    { label: name },
  ];

  const renderIcon = (iconName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="container-app py-8 space-y-8">
      <Breadcrumb items={breadcrumbItems} />

      <AdSlot position="header" />

      {/* Category header info card */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-xl">
        <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight mb-2">
          {name}
        </h1>
        <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
          {desc}
        </p>
      </div>

      {/* Category calculations list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => {
          const calcTitle = tGlobal(`${calc.translationNamespace}.title`);
          const calcDesc = tGlobal(`${calc.translationNamespace}.description`);

          return (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="card card-interactive p-6 bg-surface flex flex-col justify-between gap-4 border border-border rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary-light rounded-lg border border-primary/10">
                  {renderIcon(calc.icon || 'Calculator')}
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-base text-text">
                    {calcTitle}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {calcDesc}
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

      <AdSlot position="footer" />
    </div>
  );
}

export function generateStaticParams() {
  const slugs = ['financial', 'health', 'math', 'converters', 'tech'];
  const locales = ['ar', 'en'];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}
