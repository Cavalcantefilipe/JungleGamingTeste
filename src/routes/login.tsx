import { createFileRoute } from '@tanstack/react-router';

import { AuthDialog } from '@/features/auth/components/AuthDialog';
import { authSearchSchema } from '@/features/auth/route-guard';

export const Route = createFileRoute('/login')({
  validateSearch: authSearchSchema,
  component: Login,
});
function Login() {
  const { returnTo } = Route.useSearch();
  return <AuthDialog returnTo={returnTo} />;
}
