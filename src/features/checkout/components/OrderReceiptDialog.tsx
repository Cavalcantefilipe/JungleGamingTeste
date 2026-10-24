import { useNavigate } from '@tanstack/react-router';
import { PackageCheckIcon } from 'lucide-react';
import { useEffect } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { WALLET_PROVIDER_LABELS, type Order } from '@/contracts';
import { formatEth } from '@/lib/money';

import { clearCheckoutDraft } from '../checkout-draft';

function ReceiptItems({ order }: { order: Order }) {
  return (
    <ul className="space-y-3">
      {order.items.map((item) => (
        <li
          key={`${item.nftId}-${item.editionId}`}
          className="flex items-center gap-3 rounded-control bg-surface-raised p-2"
        >
          <img src={item.image.src} alt="" className="size-14 rounded-control object-cover" />
          <span className="min-w-0 flex-1 text-caption">
            <strong className="block truncate">{item.name}</strong>
            <span className="text-text-secondary">
              Edição {item.editionLabel} · × {item.quantity}
            </span>
          </span>
          <span className="text-caption font-bold text-text-accent">
            {formatEth(item.lineTotal)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function OrderReceiptDialog({ order }: { order: Order }) {
  useEffect(() => {
    clearCheckoutDraft(order.userId);
  }, [order.userId]);
  const navigate = useNavigate();
  const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
    new Date(order.createdAt),
  );
  const explorer =
    order.wallet.network === 'ethereum'
      ? 'Etherscan'
      : order.wallet.network === 'polygon'
        ? 'Polygonscan'
        : 'Solscan';
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) void navigate({ to: '/' });
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[min(560px,calc(100vw-2rem))] gap-0 overflow-y-auto border-border bg-surface-card p-0 text-foreground">
        <div className="border-b border-border px-6 py-6 text-center">
          <PackageCheckIcon aria-hidden className="mx-auto mb-3 size-12 text-primary" />
          <DialogTitle className="text-body-lg font-bold">
            Seus NFTs agora estão na sua carteira
          </DialogTitle>
          <DialogDescription className="mt-2 text-caption text-text-secondary" role="status">
            Compra confirmada
          </DialogDescription>
        </div>
        <div className="grid grid-cols-2 gap-3 border-b border-border px-6 py-4 text-caption sm:grid-cols-4">
          <div>
            <span className="block text-text-secondary">ID da transação</span>
            <strong className="break-all">{order.transactionRef}</strong>
          </div>
          <div>
            <span className="block text-text-secondary">Data</span>
            <strong>{date}</strong>
          </div>
          <div>
            <span className="block text-text-secondary">Total</span>
            <strong>{formatEth(order.total)}</strong>
          </div>
          <div>
            <span className="block text-text-secondary">Carteira</span>
            <strong>{WALLET_PROVIDER_LABELS[order.wallet.provider]}</strong>
          </div>
        </div>
        <div className="space-y-4 px-6 py-5">
          <h2 className="text-body font-bold">Detalhes da transação</h2>
          <ReceiptItems order={order} />
          <p className="flex justify-between border-t border-border pt-3 text-body">
            <span>Taxa de rede</span>
            <span>{formatEth(order.networkFee)}</span>
          </p>
          <p className="flex justify-between text-body font-bold">
            <span>Total</span>
            <span className="text-text-accent">{formatEth(order.total)}</span>
          </p>
          <p className="text-center text-caption text-text-secondary">
            Transação confirmada na rede {order.wallet.network}. A propriedade foi registrada na sua
            carteira conectada.
          </p>
          <a
            href={order.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex min-h-11 w-fit items-center rounded-control bg-primary px-5 font-bold text-ink hover:bg-primary-light"
          >
            Ver no {explorer}
          </a>
        </div>
        <div aria-hidden className="h-2 bg-primary" />
      </DialogContent>
    </Dialog>
  );
}
