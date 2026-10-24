import { createFileRoute } from '@tanstack/react-router';

import { AuthDialog } from '@/features/auth/components/AuthDialog';
import { authSearchSchema, redirectIfAuthenticated } from '@/features/auth/route-guard';

export const Route = createFileRoute('/register')({
  validateSearch: authSearchSchema,
  staticData: { hideFooter: true, mobileFlow: true },
  beforeLoad: ({ search }) => {
    redirectIfAuthenticated(search);
  },
  component: RegisterRoute,
});

function RegisterRoute() {
  const { returnTo } = Route.useSearch();
  return <AuthDialog mode="register" returnTo={returnTo} />;
}
