import { Link } from '@tanstack/react-router';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/features/auth/session-store';
import { useCartQuery } from '@/features/cart/queries';
import { MobilePageHeader } from '@/features/layout/MobilePageHeader';
import { useProfileQuery } from '@/features/profile/queries';
import { useWalletsQuery } from '@/features/wallets/queries';

import { CheckoutContent } from './CheckoutContent';

export function CheckoutPage() {
  const session = useSession();
  const cart = useCartQuery();
  const profile = useProfileQuery();
  const wallets = useWalletsQuery();
  const error = cart.error ?? profile.error ?? wallets.error;
  const initialWallet = wallets.data?.primary ?? wallets.data?.secondary;
  if (!session) return null;
  return (
    <>
      <MobilePageHeader title="Pagamento com carteira" backTo="/cart" align="start" />
      <h1 className="mt-2 mb-8 hidden text-xs leading-4 text-text-secondary md:block">
        Início / Mercado / Pagamento
      </h1>
      {error ? (
        <ErrorState
          error={error}
          retry={() => {
            void cart.refetch();
            void profile.refetch();
            void wallets.refetch();
          }}
        />
      ) : !cart.data || !profile.data || !wallets.data ? (
        <Skeleton aria-label="Carregando pagamento" className="h-[600px] w-full" />
      ) : !cart.data.items.length ? (
        <EmptyState
          title="Seu carrinho está vazio"
          description="Escolha um NFT antes de iniciar o pagamento."
          action={
            <Button asChild>
              <Link to="/">Explorar NFTs</Link>
            </Button>
          }
        />
      ) : !initialWallet ? (
        <EmptyState
          title="Cadastre uma carteira para continuar"
          description="Sua carteira precisa ser salva antes da compra."
          action={
            <Button asChild>
              <Link to="/account/wallets" search={{ returnTo: '/checkout' }}>
                Cadastrar carteira
              </Link>
            </Button>
          }
        />
      ) : (
        <CheckoutContent
          key={`${session.user.id}:${cart.data.id}`}
          session={session}
          profile={profile.data}
          cart={cart.data}
          wallets={wallets.data}
          initialWallet={initialWallet}
        />
      )}
    </>
  );
}
