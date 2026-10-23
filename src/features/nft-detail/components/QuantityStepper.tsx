import { QuantityButton } from './QuantityButton';
import { QuantityInput } from './QuantityInput';

export interface QuantityStepperProps {
  value: number;
  max: number;
  disabled?: boolean;
  tone?: 'purchase' | 'cart';
  onChange: (quantity: number) => void;
}
export function QuantityStepper({
  value,
  max,
  onChange,
  disabled = false,
  tone = 'purchase',
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center">
      <QuantityButton
        decrease
        tone={tone}
        disabled={disabled || value <= 1}
        change={() => {
          onChange(value - 1);
        }}
      />
      <QuantityInput value={value} max={max} disabled={disabled} tone={tone} onChange={onChange} />
      <QuantityButton
        tone={tone}
        disabled={disabled || value >= max}
        change={() => {
          onChange(value + 1);
        }}
      />
    </div>
  );
}
