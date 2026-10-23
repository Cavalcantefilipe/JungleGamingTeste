import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { ProfilePage } from '@/features/profile/components/ProfilePage';

export const Route = createFileRoute('/account/profile')({
  beforeLoad: requireAuth,
  component: ProfilePage,
});
