import { formatEth } from '@/lib/money';

import type { CartEstimate } from '../estimateCart';

export function QuoteSummary({ quote }: { quote: CartEstimate }) {
  return (
    <dl className="grid min-h-[164px] grid-cols-[1fr_auto] items-start gap-x-4 gap-y-4 text-sm text-text-secondary">
      <dt>Subtotal</dt>
      <dd data-testid="quote-subtotal" className="text-right text-foreground">
        {formatEth(quote.subtotal)}
      </dd>
      <dt>Desconto do lançamento</dt>
      <dd data-testid="quote-discount" className="text-right">
        {formatEth(quote.discount)}
      </dd>
      <dt>
        Taxa de rede <span className="block text-[11px] text-secondary">Taxa estimada</span>
      </dt>
      <dd className="text-right">{formatEth(quote.networkFee)}</dd>
      <dt className="pt-1 font-bold text-foreground">Total</dt>
      <dd
        data-testid="quote-total"
        className="pt-1 text-right text-base font-bold text-text-accent"
      >
        {formatEth(quote.total)}
      </dd>
    </dl>
  );
}
