import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface CouponInputProps {
  field: UseFormRegisterReturn<'couponCode'>;
  message: string | undefined;
  disabled: boolean;
}
export function CouponInput({ field, message, disabled }: CouponInputProps) {
  return (
    <>
      <label htmlFor="coupon-code" className="hidden text-sm font-bold md:block">
        Código promocional
      </label>
      <div className="flex items-center overflow-hidden rounded-full border border-border bg-surface-card shadow-coupon md:h-10 md:rounded-field md:border-primary md:bg-transparent md:shadow-none">
        <Input
          {...field}
          id="coupon-code"
          aria-label="Código promocional"
          aria-invalid={Boolean(message)}
          aria-describedby={message ? 'coupon-error' : undefined}
          placeholder="Digite o código promocional..."
          className="h-[50px] min-w-0 border-0 bg-transparent text-xs shadow-none md:h-full md:text-xs"
        />
        <Button type="submit" size="coupon" disabled={disabled}>
          Aplicar
        </Button>
      </div>
    </>
  );
}
