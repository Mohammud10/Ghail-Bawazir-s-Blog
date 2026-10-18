import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'card bg-surface border border-border rounded-xl p-5 shadow-sm',
        interactive && 'card-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
