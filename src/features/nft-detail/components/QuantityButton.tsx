import { Button } from '@/components/ui/button';

interface QuantityButtonProps {
  decrease?: boolean;
  tone: 'purchase' | 'cart';
  disabled: boolean;
  change: () => void;
}
export function QuantityButton({ decrease = false, tone, disabled, change }: QuantityButtonProps) {
  return (
    <Button
      variant={tone === 'cart' ? 'quantity-cart' : 'quantity'}
      size={tone === 'cart' ? 'quantity' : 'quantity-purchase'}
      aria-label={decrease ? 'Diminuir quantidade' : 'Aumentar quantidade'}
      disabled={disabled}
      onClick={change}
    >
      <span aria-hidden="true" className="relative text-[21px] leading-4">
        {decrease ? '−' : '+'}
      </span>
    </Button>
  );
}
