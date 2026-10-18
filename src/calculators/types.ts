// Calculator type definitions for Smart Calculators Hub

export interface CalculatorInput {
  id: string;
  type: 'number' | 'select' | 'text' | 'radio' | 'date';
  labelKey: string;         // Translation key for label
  placeholderKey?: string;  // Translation key for placeholder
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number;
  unit?: string;
  options?: Array<{
    value: string;
    labelKey: string;
  }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    messageKey?: string;
  };
}

export interface CalculatorResultItem {
  labelKey: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  type?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
}

export interface CalculatorResult {
  items: CalculatorResultItem[];
  interpretationKey?: string;
  interpretationParams?: Record<string, string | number>;
  category?: string;
  disclaimerKey?: string;
}

export type CalculateFunction = (inputs: Record<string, number | string>) => CalculatorResult;

export interface CalculatorConfig {
  slug: string;
  categorySlug: string;
  translationNamespace: string;
  inputs: CalculatorInput[];
  calculate: CalculateFunction;
  relatedSlugs?: string[];
  icon?: string;
}

export type CategorySlug = 'financial' | 'health' | 'math' | 'converters' | 'tech';

export interface CategoryConfig {
  slug: CategorySlug;
  icon: string;
  color: string;
  calculatorSlugs: string[];
}

// Category icons and colors mapping
export const CATEGORIES: Record<CategorySlug, CategoryConfig> = {
  financial: {
    slug: 'financial',
    icon: 'DollarSign',
    color: '#059669',
    calculatorSlugs: [
      'loan-calculator', 'monthly-payment', 'simple-interest', 'compound-interest',
      'savings-calculator', 'investment-calculator', 'discount-calculator', 'tax-calculator',
      'profit-loss', 'percentage-change', 'salary-deductions', 'zakat-calculator',
      'profit-margin', 'roi-calculator', 'monthly-budget',
    ],
  },
  health: {
    slug: 'health',
    icon: 'Heart',
    color: '#DC2626',
    calculatorSlugs: [
      'bmi-calculator', 'daily-calories', 'ideal-weight', 'bmr-calculator',
      'water-intake', 'body-fat', 'pregnancy-calculator', 'due-date',
      'ovulation-calculator', 'age-calculator', 'heart-rate', 'protein-needs',
    ],
  },
  math: {
    slug: 'math',
    icon: 'Calculator',
    color: '#2563EB',
    calculatorSlugs: [
      'basic-calculator', 'percentage-calculator', 'mean-calculator', 'median-calculator',
      'mode-calculator', 'standard-deviation', 'area-square', 'area-rectangle',
      'area-circle', 'area-triangle', 'volume-cube', 'volume-cylinder',
      'volume-sphere', 'square-root', 'power-calculator', 'quadratic-equation',
      'slope-calculator', 'distance-calculator',
    ],
  },
  converters: {
    slug: 'converters',
    icon: 'ArrowLeftRight',
    color: '#7C3AED',
    calculatorSlugs: [
      'length-converter', 'weight-converter', 'temperature-converter', 'speed-converter',
      'time-converter', 'area-converter', 'volume-converter', 'pressure-converter',
      'energy-converter', 'power-converter', 'digital-storage', 'internet-speed',
      'currency-converter',
    ],
  },
  tech: {
    slug: 'tech',
    icon: 'Cpu',
    color: '#D97706',
    calculatorSlugs: [
      'download-speed', 'data-usage', 'file-size', 'password-strength',
      'number-system', 'subnet-calculator', 'cidr-calculator', 'dns-lookup',
      'download-time',
    ],
  },
};

// Get category for a calculator slug
export function getCategoryForCalculator(calculatorSlug: string): CategorySlug | undefined {
  for (const [categorySlug, category] of Object.entries(CATEGORIES)) {
    if (category.calculatorSlugs.includes(calculatorSlug)) {
      return categorySlug as CategorySlug;
    }
  }
  return undefined;
}

// Get all calculator slugs
export function getAllCalculatorSlugs(): string[] {
  return Object.values(CATEGORIES).flatMap((cat) => cat.calculatorSlugs);
}
