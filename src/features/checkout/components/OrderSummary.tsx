import {
  NFT_NETWORK_LABELS,
  WALLET_PROVIDER_LABELS,
  type Quote,
  type Wallet,
  type WalletProvider,
} from '@/contracts';
import { formatEth } from '@/lib/money';

export function OrderSummary({
  quote,
  wallet,
  provider,
}: {
  quote: Quote;
  wallet: Wallet | undefined;
  provider: WalletProvider;
}) {
  return (
    <aside
      className="rounded-control border border-border bg-surface-card p-6"
      aria-label="Resumo do pedido"
    >
      <h2 className="mb-5 hidden text-body-lg font-bold md:block">Resumo do pedido</h2>
      <ul className="space-y-4">
        {quote.items.map((item) => (
          <li key={`${item.nftId}-${item.editionId}`} className="flex items-center gap-3">
            <img src={item.image.src} alt="" className="size-14 rounded-control object-cover" />
            <span className="min-w-0 flex-1 text-caption">
              <strong className="block truncate">{item.name}</strong>
              {item.editionLabel} × {item.quantity}
            </span>
            <span className="text-caption">{formatEth(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-3 border-t border-border pt-5 text-body">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatEth(quote.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Desconto do lançamento</dt>
          <dd>(-) {formatEth(quote.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Taxa de rede</dt>
          <dd>{formatEth(quote.networkFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 font-bold text-text-accent">
          <dt>Total</dt>
          <dd>{formatEth(quote.total)}</dd>
        </div>
      </dl>
      {wallet && (
        <div className="mt-6 border-t border-border pt-5 text-body">
          <h3 className="mb-2 font-bold">Forma de pagamento</h3>
          <p>
            {WALLET_PROVIDER_LABELS[provider]} · {NFT_NETWORK_LABELS[quote.network]}
          </p>
          <p className="mt-1 text-caption break-all text-text-secondary">{wallet.address}</p>
        </div>
      )}
    </aside>
  );
}
