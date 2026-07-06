import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/class-names';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ className, tone = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span className={cn('ui-badge', `ui-badge-${tone}`, className)} {...props}>
      {children}
    </span>
  );
}
