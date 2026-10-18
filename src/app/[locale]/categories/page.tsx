import { setRequestLocale, getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CategoryGrid from '@/components/home/CategoryGrid';
import AdSlot from '@/components/ads/AdSlot';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'categories' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CategoriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'categories' });
  const breadcrumbItems = [{ label: t('title') }];

  return (
    <div className="flex-1 flex flex-col py-8">
      <div className="container-app">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <AdSlot position="header" />

      <CategoryGrid />

      <AdSlot position="footer" />
    </div>
  );
}
