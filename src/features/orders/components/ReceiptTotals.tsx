import type { Order } from '@/contracts/order';
import { compareEth, formatEth } from '@/lib/money';

export function ReceiptTotals({ order }: { order: Order }) {
  return (
    <dl className="mt-4 ml-auto grid max-w-[320px] grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-sm leading-4 text-text-secondary">
      {compareEth(order.discount, '0') > 0 && (
        <>
          <dt>Desconto</dt>
          <dd className="text-right">−{formatEth(order.discount)}</dd>
        </>
      )}
      <dt>Taxa de rede</dt>
      <dd className="text-right">{formatEth(order.networkFee)}</dd>
      <dt className="font-bold text-foreground">Total</dt>
      <dd
        data-testid="order-total"
        className="text-right text-lg leading-4 font-bold text-text-accent"
      >
        {formatEth(order.total)}
      </dd>
    </dl>
  );
}
