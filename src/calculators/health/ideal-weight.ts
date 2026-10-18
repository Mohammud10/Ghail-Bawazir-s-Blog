import { CalculatorConfig, CalculatorResult } from '../types';

export const idealWeightCalculator: CalculatorConfig = {
  slug: 'ideal-weight',
  categorySlug: 'health',
  translationNamespace: 'calculators.idealWeight',
  icon: 'Activity',
  inputs: [
    {
      id: 'gender',
      type: 'select',
      labelKey: 'gender',
      required: true,
      options: [
        { value: 'male', labelKey: 'male' },
        { value: 'female', labelKey: 'female' },
      ],
    },
    {
      id: 'height',
      type: 'number',
      labelKey: 'height',
      placeholderKey: 'heightPlaceholder',
      required: true,
      min: 100,
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const gender = String(inputs.gender || 'male');
    const height = Number(inputs.height);

    let weight = 0;
    // Devine Formula (height in cm)
    // 152.4 cm is 60 inches
    if (height > 152.4) {
      const overInches = (height - 152.4) / 2.54;
      if (gender === 'male') {
        weight = 50.0 + 2.3 * overInches;
      } else {
        weight = 45.5 + 2.3 * overInches;
      }
    } else {
      weight = gender === 'male' ? 50.0 : 45.5;
    }

    return {
      items: [
        {
          labelKey: 'idealWeight',
          value: Math.round(weight * 10) / 10,
          highlight: true,
          unit: 'kg',
          type: 'success',
        },
      ],
      disclaimerKey: 'healthDisclaimer',
    };
  },
  relatedSlugs: ['daily-calories', 'bmi-calculator'],
};
