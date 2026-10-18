'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface CalculatorFAQProps {
  faqs: FAQItem[];
}

export default function CalculatorFAQ({ faqs }: CalculatorFAQProps) {
  const t = useTranslations('calculator');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  // Generate Google Schema.org FAQPage structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="card p-6 md:p-8 bg-surface space-y-6">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 className="text-xl font-bold text-text flex items-center gap-2 border-b border-border pb-4">
        <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
        {t('faq')}
      </h2>

      <div className="divide-y divide-border">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="faq-item py-4">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between gap-4 text-start font-bold text-base text-text hover:text-primary transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-text-muted flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="mt-3 text-sm text-text-muted leading-relaxed animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
