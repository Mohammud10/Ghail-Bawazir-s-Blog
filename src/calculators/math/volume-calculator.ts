import { CalculatorConfig, CalculatorResult } from '../types';

export const volumeCalculator: CalculatorConfig = {
  slug: 'volume-calculator',
  categorySlug: 'math',
  translationNamespace: 'calculators.volumeCalculator',
  icon: 'Box',
  inputs: [
    {
      id: 'shape',
      type: 'select',
      labelKey: 'shape',
      required: true,
      options: [
        { value: 'cube', labelKey: 'cube' },
        { value: 'cylinder', labelKey: 'cylinder' },
        { value: 'sphere', labelKey: 'sphere' },
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
    const shape = String(inputs.shape || 'cube');
    const dim1 = Number(inputs.dim1);
    const dim2 = Number(inputs.dim2 || 0);

    let volume = 0;

    if (shape === 'cube') {
      volume = dim1 * dim1 * dim1;
    } else if (shape === 'cylinder') {
      volume = Math.PI * dim1 * dim1 * dim2;
    } else if (shape === 'sphere') {
      volume = (4 / 3) * Math.PI * dim1 * dim1 * dim1;
    }

    return {
      items: [
        {
          labelKey: 'volume',
          value: Math.round(volume * 100) / 100,
          highlight: true,
          unit: 'cubic units',
          type: 'success',
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['area-calculator', 'percentage-calculator'],
};
