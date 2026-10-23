import type { Wallet } from '@/contracts/wallet';

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
      <h2 className="text-base leading-4 font-bold lg:sr-only">
        {connection.connected ? 'Carteira conectada' : 'Escolha sua carteira'}
      </h2>
      <div role="radiogroup" aria-label="Carteira cadastrada" className="space-y-5 lg:hidden">
        {wallets.map((wallet) => (
          <SavedWalletOption
            key={wallet.id}
            wallet={wallet}
            selectedId={selected.id}
            select={select}
          />
        ))}
      </div>
      <h3 className="text-base leading-4 font-bold lg:text-center lg:text-section">
        Carteira e rede
      </h3>
      <div role="radiogroup" aria-label="Provedor da carteira" className="space-y-4">
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
