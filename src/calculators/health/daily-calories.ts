import { CalculatorConfig, CalculatorResult } from '../types';

export const dailyCaloriesCalculator: CalculatorConfig = {
  slug: 'daily-calories',
  categorySlug: 'health',
  translationNamespace: 'calculators.dailyCalories',
  icon: 'Flame',
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
      id: 'weight',
      type: 'number',
      labelKey: 'weight',
      placeholderKey: 'weightPlaceholder',
      required: true,
      min: 10,
    },
    {
      id: 'height',
      type: 'number',
      labelKey: 'height',
      placeholderKey: 'heightPlaceholder',
      required: true,
      min: 50,
    },
    {
      id: 'age',
      type: 'number',
      labelKey: 'age',
      placeholderKey: 'agePlaceholder',
      required: true,
      min: 1,
    },
    {
      id: 'activity',
      type: 'select',
      labelKey: 'activity',
      required: true,
      options: [
        { value: '1.2', labelKey: 'sedentary' },
        { value: '1.375', labelKey: 'light' },
        { value: '1.55', labelKey: 'moderate' },
        { value: '1.725', labelKey: 'active' },
      ],
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const gender = String(inputs.gender || 'male');
    const weight = Number(inputs.weight);
    const height = Number(inputs.height);
    const age = Number(inputs.age);
    const activity = Number(inputs.activity || 1.2);

    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }

    const maintenanceCalories = bmr * activity;

    return {
      items: [
        {
          labelKey: 'maintenance',
          value: Math.round(maintenanceCalories),
          highlight: true,
          unit: 'calories/day',
          type: 'info',
        },
        {
          labelKey: 'bmr',
          value: Math.round(bmr),
          unit: 'calories/day',
          type: 'warning',
        },
      ],
      disclaimerKey: 'healthDisclaimer',
    };
  },
  relatedSlugs: ['ideal-weight', 'bmi-calculator'],
};
