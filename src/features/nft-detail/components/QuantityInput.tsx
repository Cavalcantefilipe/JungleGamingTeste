import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

import type { QuantityStepperProps } from './QuantityStepper';

export function QuantityInput({
  value,
  max,
  disabled,
  tone,
  onChange,
}: Required<QuantityStepperProps>) {
  return (
    <Input
      disabled={disabled || max === 0}
      type="number"
      aria-label="Quantidade"
      inputMode="numeric"
      min={1}
      max={max}
      value={value}
      onChange={(event) => {
        onChange(Math.max(1, Math.min(max, Number(event.target.value) || 1)));
      }}
      className={cn(
        'h-11 w-11 [appearance:textfield] rounded-none border-0 px-0 text-center text-sm shadow-none md:h-11 md:w-6 md:text-sm [&::-webkit-inner-spin-button]:appearance-none',
        tone === 'purchase' && 'text-xl md:text-xl',
      )}
    />
  );
}
