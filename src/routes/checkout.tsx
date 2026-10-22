import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';

export const Route = createFileRoute('/checkout')({ beforeLoad: requireAuth, component: Checkout });
function Checkout() {
  return <h1 className="text-heading font-bold">Pagamento com carteira</h1>;
}
