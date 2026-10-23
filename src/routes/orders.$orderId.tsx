import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { OrderPage } from '@/features/orders/components/OrderPage';

export const Route = createFileRoute('/orders/$orderId')({
  beforeLoad: requireAuth,
  component: Order,
});
function Order() {
  const { orderId } = Route.useParams();
  return <OrderPage orderId={orderId} />;
}
