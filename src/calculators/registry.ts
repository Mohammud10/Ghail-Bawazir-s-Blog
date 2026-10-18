import { CalculatorConfig } from './types';
import { loanCalculator } from './financial/loan';
import { simpleInterestCalculator } from './financial/simple-interest';
import { compoundInterestCalculator } from './financial/compound-interest';

import { bmiCalculator } from './health/bmi';
import { dailyCaloriesCalculator } from './health/daily-calories';
import { idealWeightCalculator } from './health/ideal-weight';

import { percentageCalculator } from './math/percentage';
import { areaCalculator } from './math/area-calculator';
import { volumeCalculator } from './math/volume-calculator';

import { lengthConverter } from './converters/length';
import { weightConverter } from './converters/weight-converter';
import { temperatureConverter } from './converters/temperature-converter';

import { passwordStrength } from './tech/password-strength';
import { downloadSpeedCalculator } from './tech/download-speed';
import { fileSizeConverter } from './tech/file-size';

// All calculators registered in the application
export const calculatorsRegistry: Record<string, CalculatorConfig> = {
  'loan-calculator': loanCalculator,
  'simple-interest': simpleInterestCalculator,
  'compound-interest': compoundInterestCalculator,

  'bmi-calculator': bmiCalculator,
  'daily-calories': dailyCaloriesCalculator,
  'ideal-weight': idealWeightCalculator,

  'percentage-calculator': percentageCalculator,
  'area-calculator': areaCalculator,
  'volume-calculator': volumeCalculator,

  'length-converter': lengthConverter,
  'weight-converter': weightConverter,
  'temperature-converter': temperatureConverter,

  'password-strength': passwordStrength,
  'download-speed': downloadSpeedCalculator,
  'file-size': fileSizeConverter,
};

/**
 * Get a calculator by its slug
 */
export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return calculatorsRegistry[slug];
}

/**
 * Get all registered calculators
 */
export function getAllCalculators(): CalculatorConfig[] {
  return Object.values(calculatorsRegistry);
}

/**
 * Get calculators by category slug
 */
export function getCalculatorsByCategory(categorySlug: string): CalculatorConfig[] {
  return getAllCalculators().filter((calc) => calc.categorySlug === categorySlug);
}
