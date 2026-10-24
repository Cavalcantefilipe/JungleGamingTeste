import { Button } from '@/components/ui/button';
import { WALLET_PROVIDER_LABELS } from '@/contracts/order';
import type { Wallet } from '@/contracts/wallet';
import type { useWalletConnection } from '@/features/checkout/useWalletConnection';
import { errorMessage } from '@/lib/errors';

export function WalletConnectionStatus({
  selected,
  connection,
}: {
  selected: Wallet;
  connection: ReturnType<typeof useWalletConnection>;
}) {
  return (
    <>
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
    </>
  );
}
