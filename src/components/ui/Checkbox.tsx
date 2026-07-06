import type { MouseEventHandler } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/class-names';

interface CheckboxProps {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Checkbox({ checked, onCheckedChange, ariaLabel, className, onClick }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn('ui-checkbox', className)}
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value === true)}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <CheckboxPrimitive.Indicator className="ui-checkbox-indicator">
        {checked === 'indeterminate' ? <Minus size={11} /> : <Check size={11} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
