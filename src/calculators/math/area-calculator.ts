import { CalculatorConfig, CalculatorResult } from '../types';

export const areaCalculator: CalculatorConfig = {
  slug: 'area-calculator',
  categorySlug: 'math',
  translationNamespace: 'calculators.areaCalculator',
  icon: 'Square',
  inputs: [
    {
      id: 'shape',
      type: 'select',
      labelKey: 'shape',
      required: true,
      options: [
        { value: 'square', labelKey: 'square' },
        { value: 'rectangle', labelKey: 'rectangle' },
        { value: 'circle', labelKey: 'circle' },
      ],
    },
    {
      id: 'dim1',
      type: 'number',
      labelKey: 'dim1',
      placeholderKey: 'dim1Placeholder',
      required: true,
      min: 0.1,
    },
    {
      id: 'dim2',
      type: 'number',
      labelKey: 'dim2',
      placeholderKey: 'dim2Placeholder',
      required: false,
      min: 0.1,
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const shape = String(inputs.shape || 'square');
    const dim1 = Number(inputs.dim1);
    const dim2 = Number(inputs.dim2 || 0);

    let area = 0;

    if (shape === 'square') {
      area = dim1 * dim1;
    } else if (shape === 'rectangle') {
      area = dim1 * dim2;
    } else if (shape === 'circle') {
      area = Math.PI * dim1 * dim1;
    }

    return {
      items: [
        {
          labelKey: 'area',
          value: Math.round(area * 100) / 100,
          highlight: true,
          unit: 'sq units',
          type: 'success',
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['volume-calculator', 'percentage-calculator'],
};
