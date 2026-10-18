import { CalculatorConfig, CalculatorResult } from '../types';

export const loanCalculator: CalculatorConfig = {
  slug: 'loan-calculator',
  categorySlug: 'financial',
  translationNamespace: 'calculators.loan',
  icon: 'Landmark',
  inputs: [
    {
      id: 'loanAmount',
      type: 'number',
      labelKey: 'loanAmount',
      placeholderKey: 'amountPlaceholder',
      required: true,
      min: 1,
      step: 100,
      validation: { min: 1, messageKey: 'amountError' },
    },
    {
      id: 'interestRate',
      type: 'number',
      labelKey: 'interestRate',
      placeholderKey: 'ratePlaceholder',
      required: true,
      min: 0,
      max: 100,
      step: 0.1,
      validation: { min: 0, max: 100, messageKey: 'rateError' },
    },
    {
      id: 'loanTerm',
      type: 'number',
      labelKey: 'loanTerm',
      placeholderKey: 'termPlaceholder',
      required: true,
      min: 1,
      max: 600,
      step: 1,
      validation: { min: 1, max: 600, messageKey: 'termError' },
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const principal = Number(inputs.loanAmount);
    const annualRate = Number(inputs.interestRate);
    const termMonths = Number(inputs.loanTerm);

    let monthlyPayment: number;
    let totalInterest: number;
    let totalAmount: number;

    if (annualRate === 0) {
      // No interest — simple division
      monthlyPayment = principal / termMonths;
      totalInterest = 0;
      totalAmount = principal;
    } else {
      // Monthly interest rate
      const monthlyRate = annualRate / 100 / 12;

      // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const factor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
      totalAmount = monthlyPayment * termMonths;
      totalInterest = totalAmount - principal;
    }

    return {
      items: [
        {
          labelKey: 'monthlyPayment',
          value: Math.round(monthlyPayment * 100) / 100,
          highlight: true,
          type: 'primary',
        },
        {
          labelKey: 'totalInterest',
          value: Math.round(totalInterest * 100) / 100,
          type: 'warning',
        },
        {
          labelKey: 'totalAmount',
          value: Math.round(totalAmount * 100) / 100,
          type: 'secondary',
        },
        {
          labelKey: 'loanAmountLabel',
          value: principal,
          type: 'info',
        },
      ],
      disclaimerKey: 'financialDisclaimer',
    };
  },
  relatedSlugs: ['monthly-payment', 'compound-interest', 'simple-interest', 'savings-calculator'],
};
