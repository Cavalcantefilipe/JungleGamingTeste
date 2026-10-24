import { Link, useSearch } from '@tanstack/react-router';

import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountLayout } from '@/features/account/components/AccountLayout';
import { useProfileQuery } from '@/features/profile/queries';
import { WalletSections } from '@/features/wallets/components/WalletSections';
import { useWalletsQuery } from '@/features/wallets/queries';

export function WalletsPage() {
  const { returnTo } = useSearch({ from: '/account/wallets' });
  const profile = useProfileQuery();
  const wallets = useWalletsQuery();
  const error = profile.error ?? wallets.error;
  return (
    <AccountLayout>
      {returnTo && wallets.data?.primary && (
        <Button asChild variant="secondary" size="form" className="mb-6">
          <Link to={returnTo}>Voltar ao pagamento</Link>
        </Button>
      )}
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
        <WalletSections profile={profile.data} wallets={wallets.data} />
      )}
    </AccountLayout>
  );
}
