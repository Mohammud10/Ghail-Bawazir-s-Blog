'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const t = useTranslations('home');
  const tFaq = useTranslations('homeFaq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: tFaq('q1'), a: tFaq('a1') },
    { q: tFaq('q2'), a: tFaq('a2') },
    { q: tFaq('q3'), a: tFaq('a3') },
    { q: tFaq('q4'), a: tFaq('a4') },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 border-t border-border bg-slate-50/50">
      <div className="container-app max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-text tracking-tight">
            {t('faq')}
          </h2>
        </div>

        <div className="card p-6 bg-surface divide-y divide-border border border-border rounded-xl">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="faq-item py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between gap-4 text-start font-bold text-base text-text hover:text-primary transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-muted flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="mt-3 text-sm text-text-muted leading-relaxed animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
