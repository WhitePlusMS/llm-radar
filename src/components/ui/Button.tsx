import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/class-names';

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  className,
  variant = 'default',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn('ui-button', `ui-button-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}
