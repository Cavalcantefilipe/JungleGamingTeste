import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { SelectionIndicator } from '@/components/ui/SelectionIndicator';
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
      className="h-[65px] w-full justify-start gap-[11px] rounded-[15px] border-transparent bg-surface-card px-[13px] py-0 text-sm font-normal lg:h-[45px] lg:rounded-field lg:border-border lg:bg-transparent lg:p-3 lg:text-body-sm lg:aria-checked:border-primary"
    >
      <span
        aria-hidden="true"
        className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-raised font-bold text-text-accent lg:hidden"
      >
        {provider === 'coinbase' ? (
          <FigmaIcon name="wallet" size={24} />
        ) : provider === 'walletconnect' ? (
          'W'
        ) : (
          'M'
        )}
      </span>
      <span className="flex-1 text-left">{WALLET_PROVIDER_LABELS[provider]}</span>
      <SelectionIndicator selected={provider === selectedProvider} className="lg:-order-1" />
    </Button>
  );
}
