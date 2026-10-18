import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Calculator } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const categories = [
    { href: '/categories/financial', label: tNav('financial') },
    { href: '/categories/health', label: tNav('health') },
    { href: '/categories/math', label: tNav('math') },
    { href: '/categories/converters', label: tNav('converters') },
    { href: '/categories/tech', label: tNav('tech') },
  ];

  const quickLinks = [
    { href: '/', label: tNav('home') },
    { href: '/about', label: tNav('about') },
    { href: '/contact', label: tNav('contact') },
  ];

  const legalLinks = [
    { href: '/privacy', label: tNav('privacy') },
    { href: '/terms', label: tNav('terms') },
    { href: '/disclaimer', label: tNav('disclaimer') },
  ];

  return (
    <footer className="w-full border-t border-border bg-surface py-12 mt-auto">
      <div className="container-app grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Calculator className="h-6 w-6" />
            <span className="font-extrabold tracking-tight">
              {locale === 'ar' ? 'حاسبات ذكية' : 'Smart Calcs'}
            </span>
          </Link>
          <p className="text-sm text-text-muted leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text mb-4">
            {t('categories')}
          </h3>
          <ul className="space-y-2">
            {categories.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-text-muted hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text mb-4">
            {t('quickLinks')}
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-text-muted hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text mb-4">
            {t('legal')}
          </h3>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-text-muted hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-app border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-text-muted">
          {t('copyright', { year: currentYear })}
        </p>
        <p className="text-xs text-text-muted">
          {t('madeWith')}
        </p>
      </div>
    </footer>
  );
}
