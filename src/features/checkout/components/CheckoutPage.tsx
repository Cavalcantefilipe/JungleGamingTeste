import { useIsMutating } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/features/auth/session-store';
import { useCartQuery } from '@/features/cart/queries';
import { MobilePageHeader } from '@/features/layout/MobilePageHeader';
import { usePendingOrder } from '@/features/orders/usePendingOrder';
import { useProfileQuery } from '@/features/profile/queries';
import { useWalletsQuery } from '@/features/wallets/queries';

import { CheckoutContent } from './CheckoutContent';
import { PendingOrderRecovery } from './PendingOrderRecovery';

export function CheckoutPage() {
  const session = useSession();
  const pending = usePendingOrder(session?.user.id ?? '');
  const creating = useIsMutating({ mutationKey: ['orders', 'create', session?.user.id ?? ''] });
  const [recoveringKey, setRecoveringKey] = useState<string | null>(null);
  const cart = useCartQuery();
  const profile = useProfileQuery();
  const wallets = useWalletsQuery();
  const error = cart.error ?? profile.error ?? wallets.error;
  const initialWallet = wallets.data?.primary ?? wallets.data?.secondary;
  if (!session) return null;
  return (
    <>
      <MobilePageHeader title="Pagamento com carteira" backTo="/cart" align="start" />
      <h1 className="mt-2 mb-8 hidden text-sm leading-4 font-bold text-foreground md:block">
        Início / Mercado / Pagamento
      </h1>
      {pending &&
      !pending.orderId &&
      (creating === 0 || !cart.data?.items.length || recoveringKey === pending.key) ? (
        <PendingOrderRecovery
          session={session}
          attempt={pending}
          onRecoverStart={() => {
            setRecoveringKey(pending.key);
          }}
        />
      ) : error ? (
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
