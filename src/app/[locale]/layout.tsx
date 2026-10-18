import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../globals.css';

// Inter Font for English
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-var',
  display: 'swap',
});

// Cairo Font for Arabic
const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo-var',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Smart Calculators Hub',
    default: 'Smart Calculators Hub - Free Online Calculators',
  },
  description: 'Free online professional calculators for finance, health, math, unit conversions, and technology tools.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Set Request Locale for Static Rendering
  setRequestLocale(locale);

  // Load messages for Client Components context
  const messages = await getMessages();

  // Determine direction
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
