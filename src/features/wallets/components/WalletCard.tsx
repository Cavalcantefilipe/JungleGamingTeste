import { Wallet as WalletIcon } from 'lucide-react';

import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import { WALLET_PROVIDER_LABELS } from '@/contracts/order';
import type { Wallet } from '@/contracts/wallet';

export function WalletCard({ wallet }: { wallet: Wallet }) {
  return (
    <div className="space-y-3 rounded-xl border border-border-soft bg-surface-card p-4 text-sm">
      <div className="flex items-center gap-3">
        <WalletIcon aria-hidden="true" size={20} />
        <p className="font-bold">{wallet.walletNickname}</p>
      </div>
      <p className="text-xs text-text-secondary">
        {WALLET_PROVIDER_LABELS[wallet.walletType]} · {NFT_NETWORK_LABELS[wallet.network]}
      </p>
      <p data-testid="wallet-address" className="text-xs break-all">
        {wallet.address}
      </p>
    </div>
  );
}
