import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function QuantityStepper({
  value,
  max,
  onChange,
  disabled = false,
}: {
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-border-soft">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Diminuir quantidade"
        disabled={disabled || value <= 1}
        onClick={() => {
          onChange(value - 1);
        }}
      >
        <Minus aria-hidden="true" size={16} />
      </Button>
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
        className="h-10 w-12 [appearance:textfield] rounded-none border-0 px-0 text-center [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Aumentar quantidade"
        disabled={disabled || value >= max}
        onClick={() => {
          onChange(value + 1);
        }}
      >
        <Plus aria-hidden="true" size={16} />
      </Button>
    </div>
  );
}
