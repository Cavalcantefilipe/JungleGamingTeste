import { Circle, CircleDot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import type { Wallet } from '@/contracts/wallet';
import { cn } from '@/lib/cn';

export function SavedWalletOption({
  wallet,
  selectedId,
  select,
}: {
  wallet: Wallet;
  selectedId: string;
  select: (wallet: Wallet) => void;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      role="radio"
      aria-checked={wallet.id === selectedId}
      onClick={() => {
        select(wallet);
      }}
      className={cn(
        'h-auto min-h-20 w-full justify-start rounded-[14px] border-transparent bg-surface-card p-4 text-left text-sm font-normal whitespace-normal',
        wallet.id === selectedId && 'border-primary',
      )}
    >
      <span aria-hidden="true" className="text-primary">
        {wallet.id === selectedId ? (
          <CircleDot className="size-4" />
        ) : (
          <Circle className="size-4" />
        )}
      </span>
      <span className="grid min-w-0 gap-1 wrap-anywhere">
        <strong className="text-base">{wallet.walletNickname}</strong>
        <span className="wrap-anywhere">
          {wallet.ensName ? `${wallet.ensName}.eth` : wallet.address}
        </span>
        <span className="text-text-secondary">Rede {NFT_NETWORK_LABELS[wallet.network]}</span>
      </span>
    </Button>
  );
}
