import { CalculatorConfig, CalculatorResult } from '../types';

export const percentageCalculator: CalculatorConfig = {
  slug: 'percentage-calculator',
  categorySlug: 'math',
  translationNamespace: 'calculators.percentage',
  icon: 'Percent',
  inputs: [
    {
      id: 'calcType',
      type: 'select',
      labelKey: 'calcType',
      required: true,
      defaultValue: 'percentOf',
      options: [
        { value: 'percentOf', labelKey: 'percentOfLabel' },
        { value: 'whatPercent', labelKey: 'whatPercentLabel' },
        { value: 'percentChange', labelKey: 'percentChangeLabel' },
      ],
    },
    {
      id: 'value1',
      type: 'number',
      labelKey: 'value1',
      placeholderKey: 'value1Placeholder',
      required: true,
      step: 0.01,
    },
    {
      id: 'value2',
      type: 'number',
      labelKey: 'value2',
      placeholderKey: 'value2Placeholder',
      required: true,
      step: 0.01,
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const calcType = String(inputs.calcType || 'percentOf');
    const value1 = Number(inputs.value1);
    const value2 = Number(inputs.value2);

    let result: number;
    let resultLabel: string;
    let explanationKey: string;

    switch (calcType) {
      case 'percentOf':
        // What is X% of Y?
        result = (value1 / 100) * value2;
        resultLabel = 'percentOfResult';
        explanationKey = 'percentOfExplanation';
        break;

      case 'whatPercent':
        // X is what % of Y?
        if (value2 === 0) {
          return {
            items: [{ labelKey: 'divisionByZero', value: '∞', type: 'danger' }],
          };
        }
        result = (value1 / value2) * 100;
        resultLabel = 'whatPercentResult';
        explanationKey = 'whatPercentExplanation';
        break;

      case 'percentChange':
        // % change from X to Y
        if (value1 === 0) {
          return {
            items: [{ labelKey: 'divisionByZero', value: '∞', type: 'danger' }],
          };
        }
        result = ((value2 - value1) / Math.abs(value1)) * 100;
        resultLabel = result >= 0 ? 'increaseResult' : 'decreaseResult';
        explanationKey = 'percentChangeExplanation';
        break;

      default:
        result = 0;
        resultLabel = 'result';
        explanationKey = 'percentOfExplanation';
    }

    const roundedResult = Math.round(result * 10000) / 10000;

    return {
      items: [
        {
          labelKey: resultLabel,
          value: roundedResult,
          highlight: true,
          type: 'primary',
          unit: calcType !== 'percentOf' ? '%' : undefined,
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['percentage-change', 'discount-calculator', 'profit-margin', 'tax-calculator'],
};
