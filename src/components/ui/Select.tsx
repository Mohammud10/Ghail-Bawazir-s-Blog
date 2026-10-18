import React from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-sm font-semibold text-text mb-2">
            {label}
          </label>
        )}
        <select
          className={cn(
            'block w-full rounded-lg border border-border bg-surface px-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-danger text-xs font-semibold mt-2">{error}</span>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
export default Select;
