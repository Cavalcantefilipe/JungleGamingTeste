import { createFileRoute } from '@tanstack/react-router';

import { AuthDialog } from '@/features/auth/components/AuthDialog';
import { authSearchSchema, redirectIfAuthenticated } from '@/features/auth/route-guard';

export const Route = createFileRoute('/login')({
  validateSearch: authSearchSchema,
  staticData: { hideFooter: true, mobileFlow: true },
  beforeLoad: ({ search }) => {
    redirectIfAuthenticated(search);
  },
  component: LoginRoute,
});

function LoginRoute() {
  const { returnTo } = Route.useSearch();
  return <AuthDialog mode="login" returnTo={returnTo} />;
}
