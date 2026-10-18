'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getCalculatorBySlug } from '@/calculators/registry';
import { CalculatorResult } from '@/calculators/types';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CalculatorForm from '@/components/calculators/CalculatorForm';
import CalculatorResultView from '@/components/calculators/CalculatorResult';
import CalculatorExplanation from '@/components/calculators/CalculatorExplanation';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import AdSlot from '@/components/ads/AdSlot';

interface CalculatorPageClientProps {
  locale: string;
  slug: string;
}

export default function CalculatorPageClient({ locale, slug }: CalculatorPageClientProps) {
  const tGlobal = useTranslations();
  const config = getCalculatorBySlug(slug);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  if (!config) {
    notFound();
  }

  const title = tGlobal(`${config.translationNamespace}.title`);
  const description = tGlobal(`${config.translationNamespace}.description`);
  
  const howItWorks = tGlobal(`${config.translationNamespace}.howItWorks`);
  const formula = tGlobal(`${config.translationNamespace}.formula`);
  const example = tGlobal(`${config.translationNamespace}.exampleText`);

  const breadcrumbItems = [
    { label: tGlobal(`nav.${config.categorySlug}`), href: `/categories/${config.categorySlug}` },
    { label: title },
  ];

  const handleCalculate = (formValues: Record<string, string | number>) => {
    try {
      const calculationResult = config.calculate(formValues);
      setResult(calculationResult);
    } catch (err) {
      console.error('Calculation error:', err);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="container-app py-8 max-w-5xl space-y-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Ad top */}
      <AdSlot position="header" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main pane (Inputs, Results, explanations) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 md:p-8 bg-surface space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-text-muted leading-relaxed">
                {description}
              </p>
            </div>

            {/* Input Form container */}
            <div className="border-t border-border pt-6">
              <CalculatorForm
                config={config}
                onCalculate={handleCalculate}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Dynamic explanation guide */}
          <CalculatorExplanation
            howItWorks={howItWorks}
            formula={formula}
            example={example}
          />
        </div>

        {/* Right pane (Results and Related section) */}
        <div className="space-y-6">
          {/* Ad above result */}
          <AdSlot position="before-calculator" />

          {result ? (
            <CalculatorResultView
              result={result}
              namespace={config.translationNamespace}
            />
          ) : (
            <div className="card p-6 bg-surface text-center text-text-muted text-sm border-dashed border border-border h-[200px] flex items-center justify-center">
              {tGlobal('calculator.enterValues')}
            </div>
          )}

          {/* Ad below result */}
          <AdSlot position="after-result" />

          {config.relatedSlugs && (
            <RelatedCalculators relatedSlugs={config.relatedSlugs} />
          )}

          {/* Sidebar Desktop Ad */}
          <AdSlot position="sidebar" />
        </div>
      </div>

      {/* Ad bottom */}
      <AdSlot position="footer" />
    </div>
  );
}
