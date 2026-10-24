import { formatEth } from '@/lib/money';

import type { CartEstimate } from '../estimateCart';

export function QuoteSummary({
  quote,
  estimated = false,
}: {
  quote: CartEstimate;
  estimated?: boolean;
}) {
  return (
    <dl className="grid min-h-[128px] grid-cols-[1fr_auto] items-start gap-x-4 gap-y-3 text-body-sm text-foreground">
      <dt>Subtotal</dt>
      <dd data-testid="quote-subtotal" className="text-right text-[18px] leading-5">
        {formatEth(quote.subtotal)}
      </dd>
      <dt>Desconto do lançamento</dt>
      <dd data-testid="quote-discount" className="text-right">
        (-) {formatEth(quote.discount)}
      </dd>
      <dt>Taxa de rede</dt>
      <dd className="text-right">
        <span data-testid="quote-network-fee" className="block text-[18px] leading-5">
          {formatEth(quote.networkFee)}
        </span>
        <span className="block text-xs leading-4 text-text-accent md:mt-3">Taxa estimada</span>
      </dd>
      <dt className="text-base leading-4 font-bold text-foreground">
        {estimated ? 'Total estimado' : 'Total'}
      </dt>
      <dd
        data-testid="quote-total"
        className="text-right text-[18px] leading-4 font-bold text-text-accent"
      >
        {formatEth(quote.total)}
      </dd>
    </dl>
  );
}
