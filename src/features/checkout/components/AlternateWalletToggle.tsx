import { RoundCheckbox } from '@/components/ui/RoundCheckbox';
import type { Wallet } from '@/contracts/wallet';

export function AlternateWalletToggle({
  wallet,
  wallets,
  select,
}: {
  wallet: Wallet;
  wallets: Wallet[];
  select: (wallet: Wallet) => void;
}) {
  return (
    <label
      htmlFor="alternate-wallet"
      className="hidden min-h-11 items-center gap-2 text-sm text-foreground lg:flex"
    >
      <RoundCheckbox
        id="alternate-wallet"
        checked={wallet.role === 'secondary'}
        disabled={
          !wallets.some((entry) => entry.role === 'primary') ||
          !wallets.some((entry) => entry.role === 'secondary')
        }
        onChange={(event) => {
          const candidate = wallets.find(
            (entry) => entry.role === (event.currentTarget.checked ? 'secondary' : 'primary'),
          );
          if (candidate) select(candidate);
        }}
      />
      Usar outra carteira?
    </label>
  );
}
