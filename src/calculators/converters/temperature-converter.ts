import { CalculatorConfig, CalculatorResult } from '../types';

export const temperatureConverter: CalculatorConfig = {
  slug: 'temperature-converter',
  categorySlug: 'converters',
  translationNamespace: 'calculators.temperatureConverter',
  icon: 'Thermometer',
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
        { value: 'c', labelKey: 'celsius' },
        { value: 'f', labelKey: 'fahrenheit' },
        { value: 'k', labelKey: 'kelvin' },
      ],
    },
    {
      id: 'toUnit',
      type: 'select',
      labelKey: 'toUnit',
      required: true,
      options: [
        { value: 'c', labelKey: 'celsius' },
        { value: 'f', labelKey: 'fahrenheit' },
        { value: 'k', labelKey: 'kelvin' },
      ],
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const value = Number(inputs.value);
    const fromUnit = String(inputs.fromUnit || 'c');
    const toUnit = String(inputs.toUnit || 'f');

    // Convert from unit to Celsius
    let celsius = 0;
    if (fromUnit === 'c') {
      celsius = value;
    } else if (fromUnit === 'f') {
      celsius = ((value - 32) * 5) / 9;
    } else if (fromUnit === 'k') {
      celsius = value - 273.15;
    }

    // Convert from Celsius to target unit
    let result = 0;
    if (toUnit === 'c') {
      result = celsius;
    } else if (toUnit === 'f') {
      result = (celsius * 9) / 5 + 32;
    } else if (toUnit === 'k') {
      result = celsius + 273.15;
    }

    return {
      items: [
        {
          labelKey: 'conversionResult',
          value: Math.round(result * 100) / 100,
          highlight: true,
          unit: toUnit.toUpperCase(),
          type: 'info',
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['length-converter', 'weight-converter'],
};
