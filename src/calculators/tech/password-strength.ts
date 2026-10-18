import { CalculatorConfig, CalculatorResult } from '../types';

export const passwordStrength: CalculatorConfig = {
  slug: 'password-strength',
  categorySlug: 'tech',
  translationNamespace: 'calculators.passwordStrength',
  icon: 'ShieldAlert',
  inputs: [
    {
      id: 'password',
      type: 'text',
      labelKey: 'passwordLabel',
      placeholderKey: 'passwordPlaceholder',
      required: true,
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const password = String(inputs.password || '');

    if (!password) {
      return {
        items: [
          {
            labelKey: 'score',
            value: 0,
            highlight: true,
            type: 'danger',
          },
          {
            labelKey: 'strength',
            value: 'empty',
            type: 'danger',
          },
        ],
      };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    else feedback.push('lengthTip');

    // Lowercase
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('lowercaseTip');

    // Uppercase
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('uppercaseTip');

    // Numbers
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('numberTip');

    // Special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('specialTip');

    // Map score (max 6) to strength levels
    let strengthKey = 'weak';
    let strengthType: 'danger' | 'warning' | 'success' = 'danger';

    if (score >= 5) {
      strengthKey = 'strong';
      strengthType = 'success';
    } else if (score >= 3) {
      strengthKey = 'medium';
      strengthType = 'warning';
    }

    return {
      items: [
        {
          labelKey: 'score',
          value: `${score}/6`,
          highlight: true,
          type: strengthType,
        },
        {
          labelKey: 'strength',
          value: strengthKey,
          type: strengthType,
        },
        {
          labelKey: 'tips',
          value: feedback.length > 0 ? feedback.join(', ') : 'perfectPassword',
          type: 'info',
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['download-speed', 'file-size', 'number-system'],
};
