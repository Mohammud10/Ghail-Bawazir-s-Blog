import { CalculatorConfig, CalculatorResult } from '../types';

export const bmiCalculator: CalculatorConfig = {
  slug: 'bmi-calculator',
  categorySlug: 'health',
  translationNamespace: 'calculators.bmi',
  icon: 'Scale',
  inputs: [
    {
      id: 'weight',
      type: 'number',
      labelKey: 'weight',
      placeholderKey: 'weightPlaceholder',
      required: true,
      min: 1,
      max: 500,
      step: 0.1,
      unit: 'kg',
      validation: { min: 1, max: 500, messageKey: 'weightError' },
    },
    {
      id: 'height',
      type: 'number',
      labelKey: 'height',
      placeholderKey: 'heightPlaceholder',
      required: true,
      min: 30,
      max: 300,
      step: 0.1,
      unit: 'cm',
      validation: { min: 30, max: 300, messageKey: 'heightError' },
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const weight = Number(inputs.weight);
    const heightCm = Number(inputs.height);
    const heightM = heightCm / 100;

    // BMI = weight(kg) / height(m)²
    const bmi = weight / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 100) / 100;

    // Determine category
    let categoryKey: string;
    let categoryType: 'success' | 'warning' | 'danger' | 'info';

    if (bmi < 18.5) {
      categoryKey = 'underweight';
      categoryType = 'warning';
    } else if (bmi < 25) {
      categoryKey = 'normal';
      categoryType = 'success';
    } else if (bmi < 30) {
      categoryKey = 'overweight';
      categoryType = 'warning';
    } else if (bmi < 40) {
      categoryKey = 'obese';
      categoryType = 'danger';
    } else {
      categoryKey = 'severelyObese';
      categoryType = 'danger';
    }

    // Calculate healthy weight range
    const minHealthyWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
    const maxHealthyWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

    return {
      items: [
        {
          labelKey: 'yourBmi',
          value: bmiRounded,
          highlight: true,
          type: 'primary',
        },
        {
          labelKey: 'category',
          value: categoryKey,
          type: categoryType,
        },
        {
          labelKey: 'healthyRange',
          value: `${minHealthyWeight} - ${maxHealthyWeight}`,
          unit: 'kg',
          type: 'info',
        },
      ],
      category: categoryKey,
      disclaimerKey: 'healthDisclaimer',
    };
  },
  relatedSlugs: ['ideal-weight', 'daily-calories', 'bmr-calculator', 'body-fat'],
};
