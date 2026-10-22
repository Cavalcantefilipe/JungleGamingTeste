import { MinusIcon, PlusIcon } from 'lucide-react';

import { MAX_ITEM_QUANTITY } from '@/contracts';
import { cn } from '@/lib/cn';

import { detailMessages } from '../messages';

interface QuantityStepperProps {
  value: number;
  available: number;
  onChange: (value: number) => void;
  compact?: boolean;
}

export function QuantityStepper({
  value,
  available,
  onChange,
  compact = false,
}: QuantityStepperProps) {
  const max = Math.min(available, MAX_ITEM_QUANTITY);
  const buttonClass =
    'grid size-8 place-items-center rounded-full border border-border-soft text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40';
  return (
    <div className={cn('flex items-center gap-3', compact ? 'gap-2' : 'gap-3')}>
      {!compact && <span className="text-body text-foreground">Qtd.</span>}
      <button
        type="button"
        aria-label="Diminuir quantidade"
        disabled={value <= 1}
        onClick={() => {
          onChange(value - 1);
        }}
        className={buttonClass}
      >
        <MinusIcon aria-hidden className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={detailMessages.quantity}
        min={1}
        max={max}
        value={value}
        onChange={(event) => {
          onChange(Number(event.target.value) || 1);
        }}
        className="w-12 [appearance:textfield] rounded-control border border-border bg-transparent py-1 text-center text-body text-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Aumentar quantidade"
        disabled={value >= max}
        onClick={() => {
          onChange(value + 1);
        }}
        className={buttonClass}
      >
        <PlusIcon aria-hidden className="size-4" />
      </button>
      {!compact && (
        <span className="text-caption text-text-secondary">
          {detailMessages.available(available)}
        </span>
      )}
    </div>
  );
}
