import { CalculatorConfig, CalculatorResult } from '../types';

export const weightConverter: CalculatorConfig = {
  slug: 'weight-converter',
  categorySlug: 'converters',
  translationNamespace: 'calculators.weightConverter',
  icon: 'Weight',
  inputs: [
    {
      id: 'value',
      type: 'number',
      labelKey: 'value',
      placeholderKey: 'valuePlaceholder',
      required: true,
    },
    {
      id: 'fromUnit',
      type: 'select',
      labelKey: 'fromUnit',
      required: true,
      options: [
        { value: 'kg', labelKey: 'kg' },
        { value: 'lbs', labelKey: 'lbs' },
        { value: 'g', labelKey: 'g' },
        { value: 'oz', labelKey: 'oz' },
      ],
    },
    {
      id: 'toUnit',
      type: 'select',
      labelKey: 'toUnit',
      required: true,
      options: [
        { value: 'kg', labelKey: 'kg' },
        { value: 'lbs', labelKey: 'lbs' },
        { value: 'g', labelKey: 'g' },
        { value: 'oz', labelKey: 'oz' },
      ],
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const value = Number(inputs.value);
    const fromUnit = String(inputs.fromUnit || 'kg');
    const toUnit = String(inputs.toUnit || 'lbs');

    // Factors relative to 1 kg
    const factors: Record<string, number> = {
      kg: 1,
      lbs: 0.45359237,
      g: 0.001,
      oz: 0.028349523,
    };

    const valueInKg = value * factors[fromUnit];
    const convertedValue = valueInKg / factors[toUnit];

    return {
      items: [
        {
          labelKey: 'conversionResult',
          value: Math.round(convertedValue * 10000) / 10000,
          highlight: true,
          unit: toUnit,
          type: 'info',
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['length-converter', 'temperature-converter'],
};
