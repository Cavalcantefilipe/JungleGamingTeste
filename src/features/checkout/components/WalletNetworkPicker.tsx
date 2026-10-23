import type { Wallet } from '@/contracts/wallet';
import { cn } from '@/lib/cn';

import { SavedWalletOption } from './SavedWalletOption';
import { WalletConnectionStatus } from './WalletConnectionStatus';
import { WalletProviderOption } from './WalletProviderOption';

import type { useWalletConnection } from '../useWalletConnection';

export function WalletNetworkPicker({
  wallets,
  selected,
  select,
  connection,
}: {
  wallets: Wallet[];
  selected: Wallet;
  select: (wallet: Wallet) => void;
  connection: ReturnType<typeof useWalletConnection>;
}) {
  return (
    <section className="space-y-4" aria-label="Carteira e rede">
      <h2 className={cn('text-base font-bold', !connection.connected && 'lg:sr-only')}>
        {connection.connected ? 'Carteira conectada' : 'Escolha sua carteira'}
      </h2>
      <div role="radiogroup" aria-label="Carteira cadastrada" className="space-y-3 lg:hidden">
        {wallets.map((wallet) => (
          <SavedWalletOption
            key={wallet.id}
            wallet={wallet}
            selectedId={selected.id}
            select={select}
          />
        ))}
      </div>
      <h3 className="text-base font-bold">Carteira e rede</h3>
      <div role="radiogroup" aria-label="Provedor da carteira" className="space-y-3">
        {(['walletconnect', 'metamask', 'coinbase'] as const).map((provider) => (
          <WalletProviderOption
            key={provider}
            provider={provider}
            selectedProvider={selected.walletType}
          />
        ))}
      </div>
      <WalletConnectionStatus selected={selected} connection={connection} />
    </section>
  );
}
