import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

export function QuantityStepper({
  value,
  max,
  onChange,
  disabled = false,
  tone = 'purchase',
}: {
  value: number;
  max: number;
  disabled?: boolean;
  tone?: 'purchase' | 'cart';
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="inline-flex items-center">
      <Button
        variant={tone === 'cart' ? 'quantity-cart' : 'quantity'}
        size={tone === 'cart' ? 'quantity' : 'quantity-purchase'}
        aria-label="Diminuir quantidade"
        disabled={disabled || value <= 1}
        onClick={() => {
          onChange(value - 1);
        }}
      >
        <span aria-hidden="true" className="relative text-[21px] leading-4">
          −
        </span>
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
        className={cn(
          'h-11 w-11 [appearance:textfield] rounded-none border-0 px-0 text-center text-sm shadow-none md:h-11 md:w-6 md:text-sm [&::-webkit-inner-spin-button]:appearance-none',
          tone === 'purchase' && 'text-xl md:text-xl',
        )}
      />
      <Button
        variant={tone === 'cart' ? 'quantity-cart' : 'quantity'}
        size={tone === 'cart' ? 'quantity' : 'quantity-purchase'}
        aria-label="Aumentar quantidade"
        disabled={disabled || value >= max}
        onClick={() => {
          onChange(value + 1);
        }}
      >
        <span aria-hidden="true" className="relative text-[21px] leading-4">
          +
        </span>
      </Button>
    </div>
  );
}
