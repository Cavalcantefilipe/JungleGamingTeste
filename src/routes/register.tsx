import { createFileRoute } from '@tanstack/react-router';

import { AuthDialog } from '@/features/auth/components/AuthDialog';
import { authSearchSchema, redirectIfAuthenticated } from '@/features/auth/route-guard';
import { HomePage } from '@/features/catalog/components/HomePage';

export const Route = createFileRoute('/register')({
  validateSearch: authSearchSchema,
  beforeLoad: ({ search }) => {
    redirectIfAuthenticated(search);
  },
  component: RegisterRoute,
});

function RegisterRoute() {
  const { returnTo } = Route.useSearch();
  return (
    <>
      <HomePage />
      <AuthDialog mode="register" returnTo={returnTo} />
    </>
  );
}
