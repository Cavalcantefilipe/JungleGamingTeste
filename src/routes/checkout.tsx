import { createFileRoute, redirect } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { sessionStore } from '@/features/auth/session-store';
import { CheckoutPage } from '@/features/checkout/components/CheckoutPage';
import { CheckoutRecoveryError } from '@/features/checkout/components/CheckoutRecoveryError';
import { readPendingOrder } from '@/features/orders/pending-order';

export const Route = createFileRoute('/checkout')({
  beforeLoad: async (context) => {
    await requireAuth(context);
    const session = sessionStore.getSnapshot();
    if (!session) return;
    const pending = readPendingOrder(session.user.id);
    if (pending?.orderId)
      redirect({ throw: true, to: '/orders/$orderId', params: { orderId: pending.orderId } });
  },
  component: CheckoutPage,
  errorComponent: CheckoutRecoveryError,
});
