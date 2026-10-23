import { Circle, CircleDot, Wallet as WalletIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { WALLET_PROVIDER_LABELS, type WalletProvider } from '@/contracts/order';

export function WalletProviderOption({
  provider,
  selectedProvider,
}: {
  provider: WalletProvider;
  selectedProvider: WalletProvider;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      role="radio"
      aria-checked={provider === selectedProvider}
      disabled={provider !== selectedProvider}
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
        {provider === selectedProvider ? (
          <CircleDot className="size-4" />
        ) : (
          <Circle className="size-4" />
        )}
      </span>
    </Button>
  );
}
