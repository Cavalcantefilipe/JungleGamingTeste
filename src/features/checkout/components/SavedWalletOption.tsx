import { Button } from '@/components/ui/button';
import { SelectionIndicator } from '@/components/ui/SelectionIndicator';
import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import type { Wallet } from '@/contracts/wallet';

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
      className="h-auto min-h-[93px] w-full justify-start gap-[19px] rounded-[14px] border-transparent bg-surface-card px-[18px] py-[11px] text-left text-sm font-normal whitespace-normal"
    >
      <SelectionIndicator selected={wallet.id === selectedId} />
      <span className="grid min-w-0 leading-[22px] wrap-anywhere">
        <strong className="text-base">{wallet.walletNickname}</strong>
        <span className="wrap-anywhere text-text-secondary">
          {wallet.ensName ? `${wallet.ensName}.eth` : wallet.address}
        </span>
        <span className="text-text-secondary">Rede {NFT_NETWORK_LABELS[wallet.network]}</span>
      </span>
    </Button>
  );
}
