import { setRequestLocale, getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/layout/Breadcrumb';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'terms' });

  const breadcrumbItems = [{ label: t('title') }];

  return (
    <div className="container-app py-8 max-w-4xl">
      <Breadcrumb items={breadcrumbItems} />

      <article className="card p-6 md:p-8 bg-surface space-y-6">
        <h1 className="text-3xl font-extrabold text-text tracking-tight border-b border-border pb-4">
          {t('title')}
        </h1>
        <p className="text-base text-text-muted leading-relaxed whitespace-pre-line">
          {t('content')}
        </p>
      </article>
    </div>
  );
}
