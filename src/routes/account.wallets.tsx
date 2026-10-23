import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { WalletsPage } from '@/features/wallets/components/WalletsPage';

export const Route = createFileRoute('/account/wallets')({
  beforeLoad: requireAuth,
  component: WalletsPage,
});
