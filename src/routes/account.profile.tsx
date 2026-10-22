import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { useSession } from '@/features/auth/session-store';

export const Route = createFileRoute('/account/profile')({
  beforeLoad: requireAuth,
  component: Profile,
});
function Profile() {
  const session = useSession();
  return (
    <section>
      <h1 className="text-heading">Perfil do colecionador</h1>
      <p>{session?.user.displayName}</p>
    </section>
  );
}
