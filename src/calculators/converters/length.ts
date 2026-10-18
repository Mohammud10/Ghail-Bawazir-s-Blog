import { CalculatorConfig, CalculatorResult } from '../types';

// Conversion factors relative to meters
const LENGTH_UNITS: Record<string, { factor: number; labelKey: string }> = {
  meter: { factor: 1, labelKey: 'meter' },
  kilometer: { factor: 1000, labelKey: 'kilometer' },
  centimeter: { factor: 0.01, labelKey: 'centimeter' },
  millimeter: { factor: 0.001, labelKey: 'millimeter' },
  mile: { factor: 1609.344, labelKey: 'mile' },
  yard: { factor: 0.9144, labelKey: 'yard' },
  foot: { factor: 0.3048, labelKey: 'foot' },
  inch: { factor: 0.0254, labelKey: 'inch' },
};

export const lengthConverter: CalculatorConfig = {
  slug: 'length-converter',
  categorySlug: 'converters',
  translationNamespace: 'calculators.length',
  icon: 'Ruler',
  inputs: [
    {
      id: 'value',
      type: 'number',
      labelKey: 'value',
      placeholderKey: 'valuePlaceholder',
      required: true,
      step: 0.0001,
    },
    {
      id: 'fromUnit',
      type: 'select',
      labelKey: 'fromUnit',
      required: true,
      defaultValue: 'meter',
      options: Object.entries(LENGTH_UNITS).map(([value, { labelKey }]) => ({
        value,
        labelKey,
      })),
    },
    {
      id: 'toUnit',
      type: 'select',
      labelKey: 'toUnit',
      required: true,
      defaultValue: 'foot',
      options: Object.entries(LENGTH_UNITS).map(([value, { labelKey }]) => ({
        value,
        labelKey,
      })),
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const value = Number(inputs.value);
    const fromUnit = String(inputs.fromUnit);
    const toUnit = String(inputs.toUnit);

    const fromFactor = LENGTH_UNITS[fromUnit]?.factor ?? 1;
    const toFactor = LENGTH_UNITS[toUnit]?.factor ?? 1;

    // Convert: value → meters → target unit
    const meters = value * fromFactor;
    const result = meters / toFactor;

    // Smart rounding
    const roundedResult = result < 0.01
      ? Number(result.toPrecision(6))
      : Math.round(result * 10000) / 10000;

    // Show all conversions
    const allConversions = Object.entries(LENGTH_UNITS)
      .filter(([key]) => key !== fromUnit)
      .slice(0, 5)
      .map(([key, { labelKey }]) => ({
        labelKey,
        value: Math.round((meters / LENGTH_UNITS[key].factor) * 10000) / 10000,
        type: key === toUnit ? ('primary' as const) : ('info' as const),
        highlight: key === toUnit,
      }));

    return {
      items: [
        {
          labelKey: 'conversionResult',
          value: roundedResult,
          highlight: true,
          type: 'primary',
        },
        ...allConversions,
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['weight-converter', 'area-converter', 'speed-converter', 'temperature-converter'],
};
