import { Circle, CircleDot, Wallet as WalletIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import { WALLET_PROVIDER_LABELS } from '@/contracts/order';
import type { Wallet } from '@/contracts/wallet';
import { cn } from '@/lib/cn';
import { errorMessage } from '@/lib/errors';

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
          <Button
            key={wallet.id}
            type="button"
            variant="secondary"
            role="radio"
            aria-checked={wallet.id === selected.id}
            onClick={() => {
              select(wallet);
            }}
            className={cn(
              'h-auto min-h-20 w-full justify-start rounded-[14px] border-transparent bg-surface-card p-4 text-left text-sm font-normal whitespace-normal',
              wallet.id === selected.id && 'border-primary',
            )}
          >
            <span aria-hidden="true" className="text-primary">
              {wallet.id === selected.id ? (
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
        ))}
      </div>
      <h3 className="text-base font-bold">Carteira e rede</h3>
      <div role="radiogroup" aria-label="Provedor da carteira" className="space-y-3">
        {(['walletconnect', 'metamask', 'coinbase'] as const).map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="secondary"
            role="radio"
            aria-checked={provider === selected.walletType}
            disabled={provider !== selected.walletType}
            className="h-16 w-full justify-start rounded-[14px] border-transparent bg-surface-card p-4 text-sm font-normal lg:h-11 lg:rounded-control lg:border-border-soft lg:bg-transparent lg:p-3"
          >
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-surface-raised text-primary lg:hidden"
            >
              {provider === 'coinbase' ? (
                <WalletIcon className="size-5" />
              ) : provider === 'walletconnect' ? (
                'W'
              ) : (
                'M'
              )}
            </span>
            <span className="flex-1 text-left">{WALLET_PROVIDER_LABELS[provider]}</span>
            <span aria-hidden="true" className="text-primary">
              {provider === selected.walletType ? (
                <CircleDot className="size-4" />
              ) : (
                <Circle className="size-4" />
              )}
            </span>
          </Button>
        ))}
      </div>
      {!connection.connected && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={connection.connecting}
          onClick={() => {
            connection.connect({
              walletId: selected.id,
              provider: selected.walletType,
              address: selected.address,
              network: selected.network,
            });
          }}
        >
          {connection.connecting
            ? 'Conectando…'
            : `Conectar ${WALLET_PROVIDER_LABELS[selected.walletType]}`}
        </Button>
      )}
      {connection.error && (
        <p role="alert" className="text-xs text-text-coral">
          {errorMessage(connection.error)}
        </p>
      )}
    </section>
  );
}
