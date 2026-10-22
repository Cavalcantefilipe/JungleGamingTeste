import { createFileRoute } from '@tanstack/react-router';

import { AuthDialog } from '@/features/auth/components/AuthDialog';
import { authSearchSchema } from '@/features/auth/route-guard';

export const Route = createFileRoute('/register')({
  validateSearch: authSearchSchema,
  component: Register,
});
function Register() {
  const { returnTo } = Route.useSearch();
  return <AuthDialog register returnTo={returnTo} />;
}
