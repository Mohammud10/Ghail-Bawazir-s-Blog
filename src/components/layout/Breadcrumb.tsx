'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const SeparatorIcon = isRtl ? ChevronLeft : ChevronRight;

  // Generate schema.org breadcrumb structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${item.href}` : undefined,
    })),
  };

  return (
    <nav className="flex mb-6 py-2 px-1 text-sm text-text-muted" aria-label="Breadcrumb">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ol className="inline-flex items-center space-x-1 md:space-x-2 space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center hover:text-primary font-medium transition-colors"
          >
            {isRtl ? 'الرئيسية' : 'Home'}
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1 md:gap-2">
              <SeparatorIcon className="h-4 w-4 text-text-light flex-shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-text truncate max-w-[150px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary font-medium transition-colors truncate max-w-[150px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
