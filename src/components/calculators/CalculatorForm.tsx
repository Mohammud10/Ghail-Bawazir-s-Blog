'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorConfig } from '@/calculators/types';

interface CalculatorFormProps {
  config: CalculatorConfig;
  onCalculate: (values: Record<string, string | number>) => void;
  onReset: () => void;
}

export default function CalculatorForm({ config, onCalculate, onReset }: CalculatorFormProps) {
  const t = useTranslations();
  const tCalc = useTranslations('calculator');

  // Initialize form state
  const initialValues = () => {
    const vals: Record<string, string | number> = {};
    config.inputs.forEach((input) => {
      vals[input.id] = input.defaultValue !== undefined ? input.defaultValue : '';
    });
    return vals;
  };

  const [formValues, setFormValues] = useState<Record<string, string | number>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    // Clear error
    if (errors[id]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    config.inputs.forEach((input) => {
      const val = formValues[input.id];

      // Required check
      if (input.required && (val === '' || val === undefined || val === null)) {
        newErrors[input.id] = t('common.required');
        return;
      }

      // Numeric validations
      if (input.type === 'number' && val !== '') {
        const num = Number(val);
        if (isNaN(num)) {
          newErrors[input.id] = t('common.error');
          return;
        }

        if (input.min !== undefined && num < input.min) {
          newErrors[input.id] = `${t('common.error')}: min ${input.min}`;
        }
        if (input.max !== undefined && num > input.max) {
          newErrors[input.id] = `${t('common.error')}: max ${input.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCalculate(formValues);
    }
  };

  const handleReset = () => {
    setFormValues(initialValues());
    setErrors({});
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {config.inputs.map((input) => {
          const label = t(`${config.translationNamespace}.${input.labelKey}`);
          const placeholder = input.placeholderKey
            ? t(`${config.translationNamespace}.${input.placeholderKey}`)
            : '';

          return (
            <div key={input.id} className="flex flex-col">
              <label htmlFor={input.id} className="block text-sm font-semibold text-text mb-2">
                {label} {input.required && <span className="text-danger">*</span>}
              </label>

              {input.type === 'select' ? (
                <select
                  id={input.id}
                  value={formValues[input.id]}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {input.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(`${config.translationNamespace}.${opt.labelKey}`)}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative rounded-lg shadow-sm">
                  <input
                    id={input.id}
                    type={input.type === 'number' ? 'number' : 'text'}
                    step={input.step}
                    min={input.min}
                    max={input.max}
                    placeholder={placeholder}
                    value={formValues[input.id]}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    className={`block w-full rounded-lg border ${
                      errors[input.id] ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border focus:border-primary focus:ring-primary'
                    } bg-surface px-4 py-3 text-text shadow-sm focus:ring-1 focus:outline-none`}
                  />
                  {input.unit && (
                    <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-text-muted text-sm font-semibold">
                      {input.unit}
                    </div>
                  )}
                </div>
              )}

              {errors[input.id] && (
                <span className="text-danger text-xs font-semibold mt-2">{errors[input.id]}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 justify-center rounded-lg bg-primary hover:bg-primary-hover px-5 py-3 text-base font-bold text-white shadow-sm hover:shadow transition cursor-pointer"
        >
          {t('common.calculate')}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-border bg-surface hover:bg-background px-5 py-3 text-base font-bold text-text-muted hover:text-text shadow-sm transition cursor-pointer"
        >
          {tCalc('recalculate')}
        </button>
      </div>
    </form>
  );
}
