import { CalculatorConfig, CalculatorResult } from '../types';

export const fileSizeConverter: CalculatorConfig = {
  slug: 'file-size',
  categorySlug: 'tech',
  translationNamespace: 'calculators.fileSize',
  icon: 'HardDrive',
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
        { value: 'GB', labelKey: 'GB' },
        { value: 'MB', labelKey: 'MB' },
        { value: 'KB', labelKey: 'KB' },
        { value: 'Bytes', labelKey: 'Bytes' },
      ],
    },
    {
      id: 'toUnit',
      type: 'select',
      labelKey: 'toUnit',
      required: true,
      options: [
        { value: 'GB', labelKey: 'GB' },
        { value: 'MB', labelKey: 'MB' },
        { value: 'KB', labelKey: 'KB' },
        { value: 'Bytes', labelKey: 'Bytes' },
      ],
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const value = Number(inputs.value);
    const fromUnit = String(inputs.fromUnit || 'GB');
    const toUnit = String(inputs.toUnit || 'MB');

    // Multipliers relative to 1 Byte
    const multipliers: Record<string, number> = {
      Bytes: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    const valueInBytes = value * multipliers[fromUnit];
    const convertedValue = valueInBytes / multipliers[toUnit];

    return {
      items: [
        {
          labelKey: 'conversionResult',
          value: Math.round(convertedValue * 1000) / 1000,
          highlight: true,
          unit: toUnit,
          type: 'info',
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['download-speed', 'password-strength'],
};
