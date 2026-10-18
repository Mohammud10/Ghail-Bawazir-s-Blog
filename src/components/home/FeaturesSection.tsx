import { useTranslations } from 'next-intl';
import { ShieldCheck, Sparkles, Scale, Zap, Languages, Smartphone } from 'lucide-react';

export default function FeaturesSection() {
  const t = useTranslations('home');

  const features = [
    { icon: Scale, title: t('featAccurate'), desc: t('featAccurateDesc') },
    { icon: Sparkles, title: t('featFree'), desc: t('featFreeDesc') },
    { icon: Languages, title: t('featBilingual'), desc: t('featBilingualDesc') },
    { icon: Smartphone, title: t('featMobile'), desc: t('featMobileDesc') },
    { icon: Zap, title: t('featFast'), desc: t('featFastDesc') },
    { icon: ShieldCheck, title: t('featSecure'), desc: t('featSecureDesc') },
  ];

  return (
    <section className="py-12 border-t border-border">
      <div className="container-app space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-text tracking-tight">
            {t('features')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div key={index} className="flex gap-4 p-5 rounded-lg border border-border/50 bg-surface/50">
                <div className="p-3 bg-primary-light text-primary rounded-xl h-fit border border-primary/10">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-text">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
