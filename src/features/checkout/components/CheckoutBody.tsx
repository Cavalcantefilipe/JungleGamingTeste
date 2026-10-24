import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckoutContent } from '@/features/checkout/components/CheckoutContent';
import { CheckoutRequirement } from '@/features/checkout/components/CheckoutRequirement';
import { PendingOrderRecovery } from '@/features/checkout/components/PendingOrderRecovery';
import type { useCheckoutPageState } from '@/features/checkout/useCheckoutPageState';

export function CheckoutBody({ state }: { state: ReturnType<typeof useCheckoutPageState> }) {
  const { session, pending, recovering, cart, profile, wallets, error, initialWallet } = state;
  if (!session) return null;
  if (recovering && pending)
    return (
      <PendingOrderRecovery
        session={session}
        attempt={pending}
        onRecoverStart={() => {
          state.setRecoveringKey(pending.key);
        }}
      />
    );
  if (error) return <ErrorState error={error} retry={state.retry} />;
  if (!cart.data || !profile.data || !wallets.data)
    return <Skeleton aria-label="Carregando pagamento" className="h-[600px] w-full" />;
  if (!cart.data.items.length || !initialWallet)
    return <CheckoutRequirement emptyCart={!cart.data.items.length} />;
  return (
    <CheckoutContent
      key={`${session.user.id}:${cart.data.id}`}
      session={session}
      profile={profile.data}
      cart={cart.data}
      wallets={wallets.data}
      initialWallet={initialWallet}
    />
  );
}
