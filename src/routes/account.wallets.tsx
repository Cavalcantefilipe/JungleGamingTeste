import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';

export const Route = createFileRoute('/account/wallets')({
  beforeLoad: requireAuth,
  component: Wallets,
});
function Wallets() {
  return <h1 className="text-heading">Carteiras</h1>;
}
