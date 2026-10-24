import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { ErrorState } from '@/components/feedback/ErrorState';
import { FormSkeleton } from '@/components/feedback/skeletons';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';
import { useWallets } from '@/features/checkout/queries';
import { walletsApi } from '@/features/wallets/api';
import { WalletForm } from '@/features/wallets/components/WalletForm';
import { errorMessage } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

export const Route = createFileRoute('/_account/account/wallets')({ component: WalletsPage });

function WalletsPage() {
  const wallets = useWallets();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [showSecondary, setShowSecondary] = useState(false);
  const mirror = useMutation({
    mutationFn: () => walletsApi.save('secondary', { sameAsPrimary: true }),
    onSuccess: (saved) => queryClient.setQueryData(queryKeys.wallets(user?.id ?? ''), saved),
  });
  return (
    <div className="text-foreground">
      <h1 className="sr-only">Carteiras</h1>
      {wallets.isPending && <FormSkeleton fields={6} />}
      {wallets.isError && (
        <ErrorState
          description={errorMessage(wallets.error)}
          retrying={wallets.isFetching}
          onRetry={() => {
            void wallets.refetch();
          }}
        />
      )}
      {wallets.data && (
        <div className="space-y-10">
          <section>
            <h2 className="text-body-lg font-bold">Carteira principal</h2>
            <p className="mb-6 text-caption text-text-secondary">
              Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
            </p>
            <WalletForm
              key={wallets.data.primary?.id ?? 'new-primary'}
              walletRole="primary"
              wallet={wallets.data.primary}
            />
          </section>
          <section>
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-body-lg font-bold">Carteira secundária</h2>
              <button
                type="button"
                className="min-h-11 text-body text-text-accent hover:underline"
                onClick={() => {
                  setShowSecondary((value) => !value);
                }}
              >
                {showSecondary ? 'Fechar' : wallets.data.secondary ? 'Editar' : 'Adicionar'}
              </button>
            </div>
            {wallets.data.primary && (
              <Button
                type="button"
                variant="outline"
                className="mb-6"
                disabled={mirror.isPending}
                onClick={() => {
                  mirror.mutate();
                }}
              >
                Usar os dados da carteira principal
              </Button>
            )}
            {mirror.isError && (
              <p role="alert" className="mb-4 text-error">
                {errorMessage(mirror.error)}
              </p>
            )}
            {!showSecondary && (
              <p className="text-body text-text-secondary">
                {wallets.data.sameAsPrimary
                  ? 'A carteira secundária usa os dados da principal.'
                  : wallets.data.secondary
                    ? `${wallets.data.secondary.walletNickname} · ${wallets.data.secondary.network}`
                    : 'Você ainda não adicionou uma carteira secundária.'}
              </p>
            )}
            {showSecondary && (
              <WalletForm
                key={wallets.data.secondary?.id ?? 'new-secondary'}
                walletRole="secondary"
                wallet={wallets.data.secondary}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
