import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCalculatorBySlug, getAllCalculators } from '@/calculators/registry';
import CalculatorPageClient from '@/components/calculators/CalculatorPageClient';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const config = getCalculatorBySlug(slug);
  if (!config) return {};

  const t = await getTranslations({ locale, namespace: config.translationNamespace });
  const title = t('title');
  const description = t('description');

  return {
    title: `${title} | Smart Calculators`,
    description: description,
  };
}

export function generateStaticParams() {
  const calculators = getAllCalculators();
  const locales = ['ar', 'en'];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const calc of calculators) {
      params.push({ locale, slug: calc.slug });
    }
  }
  return params;
}

export default async function CalculatorPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const config = getCalculatorBySlug(slug);
  if (!config) {
    notFound();
  }

  return <CalculatorPageClient locale={locale} slug={slug} />;
}
