'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Search } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('home');
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="hero-gradient border-b border-border py-16 md:py-24 text-center">
      <div className="container-app max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight leading-tight animate-slideUp">
          {t('heroTitle')}
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto leading-relaxed animate-slideUp">
          {t('heroSubtitle')}
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-xl mx-auto pt-4 animate-slideUp"
        >
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-surface text-text shadow-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base font-medium"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
