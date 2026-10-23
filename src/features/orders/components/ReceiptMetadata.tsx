import type { Order } from '@/contracts/order';
import { WALLET_PROVIDER_LABELS } from '@/contracts/order';
import { formatEth } from '@/lib/money';

import { formatReceiptDate } from '../formatReceiptDate';

export function ReceiptMetadata({ order }: { order: Order }) {
  const date = formatReceiptDate(order.createdAt);
  const reference =
    order.transactionRef.length > 14
      ? `${order.transactionRef.slice(0, 6)}…${order.transactionRef.slice(-4)}`
      : order.transactionRef;
  return (
    <dl className="grid grid-cols-2 gap-y-4 border-y border-primary bg-transparent px-5 py-4 text-xs text-text-secondary md:grid-cols-[1.2fr_1.14fr_1fr_0.8fr] md:gap-y-0 md:px-7 md:text-sm md:leading-4 md:[&_dd]:text-body-sm">
      <div className="min-w-0 px-2">
        <dt className="font-bold">ID da transação</dt>
        <dd className="wrap-anywhere" title={order.transactionRef}>
          <span aria-hidden="true">{reference}</span>
          <span className="sr-only">{order.transactionRef}</span>
        </dd>
      </div>
      <div className="min-w-0 border-l border-primary/60 px-3">
        <dt>Data</dt>
        <dd className="wrap-anywhere" title={date}>
          {date}
        </dd>
      </div>
      <div className="min-w-0 px-2 md:border-l md:border-primary/60 md:px-3">
        <dt>Total</dt>
        <dd className="wrap-anywhere">{formatEth(order.total)}</dd>
      </div>
      <div className="min-w-0 border-l border-primary/60 px-3">
        <dt className="font-bold">Carteira</dt>
        <dd title={order.wallet.address}>
          {WALLET_PROVIDER_LABELS[order.wallet.provider]}
          <span className="sr-only"> {order.wallet.address}</span>
        </dd>
      </div>
    </dl>
  );
}
