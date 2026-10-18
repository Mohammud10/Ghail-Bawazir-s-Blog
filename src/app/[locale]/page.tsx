import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import PopularCalculators from '@/components/home/PopularCalculators';
import FeaturesSection from '@/components/home/FeaturesSection';
import FAQSection from '@/components/home/FAQSection';
import AdSlot from '@/components/ads/AdSlot';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Banner Ad */}
      <AdSlot position="header" />

      {/* Hero Banner with Search */}
      <HeroSection />

      {/* Main Categories Section */}
      <CategoryGrid />

      {/* Mid Banner Ad */}
      <AdSlot position="between-sections" />

      {/* Popular Calculators Grid */}
      <PopularCalculators />

      {/* Why Choose Us Features */}
      <FeaturesSection />

      {/* FAQ Accordions Section */}
      <FAQSection />

      {/* Bottom Ad */}
      <AdSlot position="footer" />
    </div>
  );
}
