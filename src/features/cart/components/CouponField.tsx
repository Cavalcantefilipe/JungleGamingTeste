import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { couponCodeSchema } from '@/contracts/quote';

const schema = z.object({ couponCode: couponCodeSchema });
export function CouponField({
  code,
  error,
  disabled,
  apply,
}: {
  code: string | undefined;
  error: string | undefined;
  disabled: boolean;
  apply: (code: string | undefined) => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { couponCode: code ?? '' },
  });
  const message = form.formState.errors.couponCode?.message ?? error;
  return (
    <form
      onSubmit={(event) => {
        void form.handleSubmit((input) => {
          apply(input.couponCode);
        })(event);
      }}
      className="space-y-2"
    >
      <label htmlFor="coupon-code" className="hidden text-xs font-bold md:block">
        Código promocional
      </label>
      <div className="flex items-center overflow-hidden rounded-full border border-border-soft bg-ink md:rounded-control">
        <Input
          {...form.register('couponCode')}
          id="coupon-code"
          aria-label="Código promocional"
          aria-invalid={Boolean(message)}
          aria-describedby={message ? 'coupon-error' : undefined}
          placeholder="Digite o código promocional..."
          className="h-12 min-w-0 border-0 bg-transparent text-xs shadow-none md:h-10"
        />
        <Button type="submit" size="coupon" disabled={disabled}>
          Aplicar
        </Button>
      </div>
      {message && (
        <p id="coupon-error" role="alert" className="text-xs text-error">
          {message}
        </p>
      )}
      {code && (
        <div className="flex items-center justify-between gap-2 text-xs text-text-secondary">
          <span>{code}</span>
          <Button
            variant="ghost"
            type="button"
            aria-label="Remover cupom"
            onClick={() => {
              apply(undefined);
              form.reset({ couponCode: '' });
            }}
          >
            Remover
          </Button>
        </div>
      )}
    </form>
  );
}
