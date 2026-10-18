import { CalculatorConfig, CalculatorResult } from '../types';

export const simpleInterestCalculator: CalculatorConfig = {
  slug: 'simple-interest',
  categorySlug: 'financial',
  translationNamespace: 'calculators.simpleInterest',
  icon: 'Percent',
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
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const principal = Number(inputs.principal);
    const rate = Number(inputs.rate);
    const time = Number(inputs.time);

    const interest = principal * (rate / 100) * time;
    const total = principal + interest;

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
  relatedSlugs: ['compound-interest', 'loan-calculator'],
};
