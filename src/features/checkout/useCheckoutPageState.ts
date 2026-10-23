import { useIsMutating } from '@tanstack/react-query';
import { useState } from 'react';

import { useSession } from '@/features/auth/session-store';
import { useCartQuery } from '@/features/cart/queries';
import { usePendingOrder } from '@/features/orders/usePendingOrder';
import { useProfileQuery } from '@/features/profile/queries';
import { useWalletsQuery } from '@/features/wallets/queries';

export function useCheckoutPageState() {
  const session = useSession();
  const pending = usePendingOrder(session?.user.id ?? '');
  const creating = useIsMutating({ mutationKey: ['orders', 'create', session?.user.id ?? ''] });
  const [recoveringKey, setRecoveringKey] = useState<string | null>(null);
  const cart = useCartQuery();
  const profile = useProfileQuery();
  const wallets = useWalletsQuery();
  const error = cart.error ?? profile.error ?? wallets.error;
  const initialWallet = wallets.data?.primary ?? wallets.data?.secondary;
  const recovering = Boolean(
    pending &&
    !pending.orderId &&
    (creating === 0 || !cart.data?.items.length || recoveringKey === pending.key),
  );
  const retry = () => {
    void cart.refetch();
    void profile.refetch();
    void wallets.refetch();
  };
  return {
    session,
    pending,
    cart,
    profile,
    wallets,
    error,
    initialWallet,
    recovering,
    retry,
    setRecoveringKey,
  };
}
