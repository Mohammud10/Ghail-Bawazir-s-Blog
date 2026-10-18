'use client';

import { useTranslations, useLocale } from 'next-intl';
import { CalculatorResult } from '@/calculators/types';
import ShareCopyButtons from './ShareCopyButtons';

interface CalculatorResultProps {
  result: CalculatorResult;
  namespace: string;
}

export default function CalculatorResultView({ result, namespace }: CalculatorResultProps) {
  const t = useTranslations();
  const tCalc = useTranslations('calculator');
  const locale = useLocale();

  // Find the primary highlighted result
  const primaryResult = result.items.find((item) => item.highlight) || result.items[0];
  const secondaryResults = result.items.filter((item) => item !== primaryResult);

  // Set of known keys that need translation lookup
  const translatableKeys = new Set([
    'underweight', 'normal', 'overweight', 'obese', 'severelyObese',
    'empty', 'weak', 'medium', 'strong',
    'perfectPassword', 'lengthTip', 'lowercaseTip', 'uppercaseTip', 'numberTip', 'specialTip'
  ]);

  // Helper to safely format values and translate them if they match configuration keys
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    const valString = String(val);
    
    // If it contains comma-separated values (like password feedback tips)
    if (valString.includes(',')) {
      const comma = locale === 'ar' ? '، ' : ', ';
      return valString
        .split(',')
        .map((k) => k.trim())
        .map((k) => (translatableKeys.has(k) ? t(`${namespace}.${k}`) : k))
        .join(comma);
    }
    
    // Translate only if it's in the list of translatable keys, otherwise output as-is (e.g. "1/6")
    return translatableKeys.has(valString) ? t(`${namespace}.${valString}`) : valString;
  };

  // Formatted string of all results for sharing/copying
  const getShareableText = () => {
    const primaryLabel = t(`${namespace}.${primaryResult.labelKey}`);
    const primaryValue = formatValue(primaryResult.value);
    const primaryUnit = primaryResult.unit || '';

    let text = `${primaryLabel}: ${primaryValue} ${primaryUnit}\n`;

    secondaryResults.forEach((item) => {
      const label = t(`${namespace}.${item.labelKey}`);
      const val = formatValue(item.value);
      const unit = item.unit || '';
      text += `${label}: ${val} ${unit}\n`;
    });

    return text;
  };

  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-light text-success border border-success/20';
      case 'warning':
        return 'bg-warning-light text-warning border border-warning/20';
      case 'danger':
        return 'bg-danger-light text-danger border border-danger/20';
      case 'info':
        return 'bg-primary-light text-primary border border-primary/20';
      default:
        return 'bg-surface text-text border border-border';
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Primary Result Display */}
      {primaryResult && (
        <div className="result-card p-6 md:p-8 flex flex-col items-center justify-center text-center animate-fadeIn max-w-full overflow-hidden">
          <span className="text-sm font-bold uppercase tracking-wider text-primary mb-2 max-w-full truncate">
            {t(`${namespace}.${primaryResult.labelKey}`)}
          </span>
          <div className="text-4xl md:text-5xl font-black text-primary mb-2 flex items-baseline justify-center gap-1 max-w-full flex-wrap break-all">
            <span>
              {formatValue(primaryResult.value)}
            </span>
            {primaryResult.unit && (
              <span className="text-xl md:text-2xl font-bold">{primaryResult.unit}</span>
            )}
          </div>

          {result.category && (
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold mt-2 ${getBadgeStyle(primaryResult.type)} max-w-full truncate`}>
              {t(`${namespace}.${result.category}`)}
            </span>
          )}
        </div>
      )}

      {/* Secondary Results Details */}
      {secondaryResults.length > 0 && (
        <div className="card p-6 bg-surface space-y-4 max-w-full overflow-hidden">
          <h3 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">
            {tCalc('details')}
          </h3>
          <div className="divide-y divide-border max-w-full">
            {secondaryResults.map((item, index) => {
              const label = t(`${namespace}.${item.labelKey}`);
              const val = formatValue(item.value);
              
              return (
                <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 gap-2 max-w-full overflow-hidden">
                  <span className="text-sm font-medium text-text-muted">{label}</span>
                  <span className={`text-base font-bold text-text px-3 py-1 rounded ${item.type ? getBadgeStyle(item.type) : ''} max-w-full break-words`}>
                    {val} {item.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Share and Copy buttons */}
      <ShareCopyButtons textToCopy={getShareableText()} />

      {/* Disclaimer */}
      {result.disclaimerKey && (
        <div className="p-4 bg-danger-light/50 border border-danger/10 rounded-lg flex items-start gap-3 max-w-full">
          <span className="inline-flex items-center justify-center p-1 bg-danger text-white rounded-full text-xs font-bold w-5 h-5 flex-shrink-0">!</span>
          <div className="space-y-1 max-w-full">
            <h4 className="text-xs font-bold text-danger uppercase tracking-wider">{tCalc('disclaimer')}</h4>
            <p className="text-xs font-medium text-danger leading-relaxed break-words">{tCalc(result.disclaimerKey)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
