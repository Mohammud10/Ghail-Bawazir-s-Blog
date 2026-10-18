import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary/50 shadow-sm hover:shadow',
    secondary: 'bg-slate-100 text-text hover:bg-slate-200 focus:ring-slate-500/50',
    outline: 'border border-border bg-surface text-text hover:bg-background focus:ring-primary/50',
    ghost: 'text-text-muted hover:text-text hover:bg-background',
    danger: 'bg-danger text-white hover:bg-danger-hover focus:ring-danger/50 shadow-sm hover:shadow',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
export default Button;
