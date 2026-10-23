import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { couponCodeSchema } from '@/contracts/quote';

const schema = z.object({ couponCode: couponCodeSchema });
import { AppliedCoupon } from './AppliedCoupon';
import { CouponInput } from './CouponInput';

interface CouponFieldProps {
  code: string | undefined;
  error: string | undefined;
  disabled: boolean;
  apply: (code: string | undefined) => void;
}
export function CouponField({ code, error, disabled, apply }: CouponFieldProps) {
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
      <CouponInput field={form.register('couponCode')} message={message} disabled={disabled} />
      {message && (
        <p id="coupon-error" role="alert" className="text-xs text-error">
          {message}
        </p>
      )}
      {code && (
        <AppliedCoupon
          code={code}
          remove={() => {
            apply(undefined);
            form.reset({ couponCode: '' });
          }}
        />
      )}
    </form>
  );
}
