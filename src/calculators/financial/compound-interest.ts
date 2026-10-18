import { CalculatorConfig, CalculatorResult } from '../types';

export const compoundInterestCalculator: CalculatorConfig = {
  slug: 'compound-interest',
  categorySlug: 'financial',
  translationNamespace: 'calculators.compoundInterest',
  icon: 'TrendingUp',
  inputs: [
    {
      id: 'principal',
      type: 'number',
      labelKey: 'principal',
      placeholderKey: 'principalPlaceholder',
      required: true,
      min: 1,
    },
    {
      id: 'rate',
      type: 'number',
      labelKey: 'rate',
      placeholderKey: 'ratePlaceholder',
      required: true,
      min: 0,
      step: 0.1,
    },
    {
      id: 'time',
      type: 'number',
      labelKey: 'time',
      placeholderKey: 'timePlaceholder',
      required: true,
      min: 0.1,
      step: 0.1,
    },
    {
      id: 'compounding',
      type: 'select',
      labelKey: 'compounding',
      required: true,
      options: [
        { value: '12', labelKey: 'monthly' },
        { value: '4', labelKey: 'quarterly' },
        { value: '1', labelKey: 'annually' },
      ],
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const principal = Number(inputs.principal);
    const rate = Number(inputs.rate);
    const time = Number(inputs.time);
    const compounding = Number(inputs.compounding || 12);

    const r = rate / 100;
    const total = principal * Math.pow(1 + r / compounding, compounding * time);
    const interest = total - principal;

    return {
      items: [
        {
          labelKey: 'interest',
          value: Math.round(interest * 100) / 100,
          highlight: true,
          unit: '$',
          type: 'info',
        },
        {
          labelKey: 'total',
          value: Math.round(total * 100) / 100,
          unit: '$',
          type: 'success',
        },
      ],
      disclaimerKey: 'financialDisclaimer',
    };
  },
  relatedSlugs: ['simple-interest', 'loan-calculator'],
};
