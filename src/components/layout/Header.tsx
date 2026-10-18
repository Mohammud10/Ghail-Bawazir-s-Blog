'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import { 
  Menu, 
  X, 
  Calculator, 
  Search, 
  ChevronDown, 
  DollarSign, 
  Activity, 
  Percent, 
  Ruler, 
  Shield 
} from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/categories', label: t('categories') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const categoriesList = [
    { slug: 'financial', icon: DollarSign, labelAr: 'حاسبات مالية', labelEn: 'Financial' },
    { slug: 'health', icon: Activity, labelAr: 'حاسبات صحية', labelEn: 'Health' },
    { slug: 'math', icon: Percent, labelAr: 'رياضيات', labelEn: 'Math' },
    { slug: 'converters', icon: Ruler, labelAr: 'محولات الوحدات', labelEn: 'Converters' },
    { slug: 'tech', icon: Shield, labelAr: 'حاسبات تقنية', labelEn: 'Technology' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Calculator className="h-6 w-6" />
          <span className="font-extrabold tracking-tight">
            {locale === 'ar' ? 'حاسبات ذكية' : 'Smart Calcs'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.href === '/categories') {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-primary transition-colors py-2 cursor-pointer focus:outline-none"
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute start-0 top-full pt-1.5 w-64 z-50">
                      <div className="rounded-xl border border-border bg-surface p-2 shadow-lg backdrop-blur-md animate-fadeIn">
                        <div className="space-y-1">
                          {categoriesList.map((cat) => {
                            const Icon = cat.icon;
                            const label = locale === 'ar' ? cat.labelAr : cat.labelEn;
                            return (
                              <Link
                                key={cat.slug}
                                href={`/categories/${cat.slug}`}
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-primary hover:bg-primary-light/50 transition-colors"
                              >
                                <Icon className="h-4 w-4 text-primary" />
                                <span>{label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors py-2"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/search"
            aria-label="Search"
            className="p-2 text-text-muted hover:text-primary rounded-full hover:bg-background transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/search"
            aria-label="Search"
            className="p-2 text-text-muted hover:text-primary rounded-full hover:bg-background transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-muted hover:text-primary rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface animate-fadeIn">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => {
              if (link.href === '/categories') {
                return (
                  <div key={link.href} className="space-y-1">
                    <button
                      onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                      className="flex w-full items-center justify-between py-2 text-base font-medium text-text-muted hover:text-primary transition-colors focus:outline-none"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {mobileCategoriesOpen && (
                      <div className="ps-4 space-y-1 border-s border-border/60">
                        {categoriesList.map((cat) => {
                          const label = locale === 'ar' ? cat.labelAr : cat.labelEn;
                          return (
                            <Link
                              key={cat.slug}
                              href={`/categories/${cat.slug}`}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileCategoriesOpen(false);
                              }}
                              className="block py-2 text-sm text-text-muted hover:text-primary transition-colors"
                            >
                              {label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-text-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border mt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted">
                {locale === 'ar' ? 'تغيير اللغة:' : 'Change Language:'}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
