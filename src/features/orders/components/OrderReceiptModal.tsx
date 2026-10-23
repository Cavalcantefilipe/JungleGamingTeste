import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import type { Order } from '@/contracts/order';

import { OrderItemsTable } from './OrderItemsTable';
import { ReceiptMetadata } from './ReceiptMetadata';
import { ReceiptTotals } from './ReceiptTotals';

export function OrderReceiptModal({ order }: { order: Order }) {
  const navigate = useNavigate();
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) void navigate({ to: '/' });
      }}
    >
      <DialogContent className="max-h-dvh gap-0 overflow-y-auto rounded-none border-0 border-b-[10px] border-primary bg-surface-card p-0 max-md:inset-0 max-md:max-w-none max-md:translate-0 md:max-h-[calc(100dvh-32px)] md:max-w-[578px]">
        <div className="flex flex-col items-center gap-4 px-6 pt-6 pb-5 text-center">
          <img
            src="/images/ui/thank-you.svg"
            alt=""
            width={80}
            height={80}
            className="mx-auto size-20"
          />
          <DialogTitle className="text-base leading-4 font-bold text-text-secondary">
            Seus NFTs agora estão na sua carteira
          </DialogTitle>
          <DialogDescription className="sr-only">
            Compra confirmada na simulação. Detalhes da transação e dos NFTs adquiridos.
          </DialogDescription>
        </div>
        <ReceiptMetadata order={order} />
        <div className="px-6 py-6 md:px-10">
          <h2 className="mb-3 text-sm leading-4 font-bold">Detalhes da transação</h2>
          <OrderItemsTable order={order} />
          <ReceiptTotals order={order} />
          <p className="mt-4 border-t border-primary/40 pt-4 text-center text-sm leading-[22px] text-text-secondary">
            Transação simulada confirmada na {NFT_NETWORK_LABELS[order.wallet.network]}. A
            propriedade foi transferida para sua carteira conectada e registrada na rede simulada.
          </p>
          <div className="mt-5 text-center">
            <Button asChild>
              <a href={order.explorerUrl} target="_blank" rel="noopener noreferrer">
                Ver no Etherscan (simulado)
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
