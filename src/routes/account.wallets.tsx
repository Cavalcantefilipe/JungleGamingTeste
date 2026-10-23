import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { requireAuth, returnToSchema } from '@/features/auth/route-guard';
import { WalletsPage } from '@/features/wallets/components/WalletsPage';

export const Route = createFileRoute('/account/wallets')({
  validateSearch: z.object({ returnTo: returnToSchema.optional() }),
  beforeLoad: requireAuth,
  component: WalletsPage,
});
