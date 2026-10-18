import { useTranslations } from 'next-intl';

interface CalculatorExplanationProps {
  howItWorks: string;
  formula: string;
  example: string;
}

export default function CalculatorExplanation({
  howItWorks,
  formula,
  example,
}: CalculatorExplanationProps) {
  const t = useTranslations('calculator');

  return (
    <div className="card p-6 md:p-8 bg-surface space-y-6">
      {/* How it works */}
      {howItWorks && (
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
            {t('howItWorks')}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
            {howItWorks}
          </p>
        </section>
      )}

      {/* Formula */}
      {formula && (
        <section className="space-y-2 border-t border-border pt-6">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
            {t('formula')}
          </h2>
          <div className="bg-background border border-border p-4 rounded-lg font-mono text-center text-primary text-base font-bold select-all overflow-x-auto">
            {formula}
          </div>
        </section>
      )}

      {/* Practical Example */}
      {example && (
        <section className="space-y-2 border-t border-border pt-6">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
            {t('example')}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed bg-background/50 border border-border/50 p-4 rounded-lg italic">
            {example}
          </p>
        </section>
      )}
    </div>
  );
}
