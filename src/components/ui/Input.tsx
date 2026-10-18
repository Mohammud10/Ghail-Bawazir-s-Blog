import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-sm font-semibold text-text mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-lg border border-border bg-surface px-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-text-light text-sm',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-danger text-xs font-semibold mt-2">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
