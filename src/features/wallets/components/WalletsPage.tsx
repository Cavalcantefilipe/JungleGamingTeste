import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountLayout } from '@/features/account/components/AccountLayout';
import { useProfileQuery } from '@/features/profile/queries';

import { walletMessages } from '../messages';
import { useWalletsQuery } from '../queries';
import { SecondaryWalletSection } from './SecondaryWalletSection';
import { WalletForm } from './WalletForm';

export function WalletsPage() {
  const profile = useProfileQuery();
  const wallets = useWalletsQuery();
  const error = profile.error ?? wallets.error;
  return (
    <AccountLayout>
      {error ? (
        <ErrorState
          error={error}
          retry={() => {
            void profile.refetch();
            void wallets.refetch();
          }}
        />
      ) : !profile.data || !wallets.data ? (
        <Skeleton aria-label="Carregando carteiras" className="h-[560px] w-full" />
      ) : (
        <>
          <section aria-labelledby="primary-heading" className="space-y-6">
            <div>
              <h1 id="primary-heading" className="text-base font-bold">
                Carteira principal
              </h1>
              <p className="mt-1 text-xs text-text-secondary">{walletMessages.help}</p>
            </div>
            <WalletForm
              key={wallets.data.primary?.id ?? 'new-primary'}
              profile={profile.data}
              wallet={wallets.data.primary}
              walletRole="primary"
            />
          </section>
          <SecondaryWalletSection profile={profile.data} wallets={wallets.data} />
        </>
      )}
    </AccountLayout>
  );
}
