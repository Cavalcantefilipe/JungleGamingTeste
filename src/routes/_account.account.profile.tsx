import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { FormSkeleton } from '@/components/feedback/skeletons';
import { useSession } from '@/features/auth/session-store';
import { profileQueryOptions } from '@/features/profile/queries';

export const Route = createFileRoute('/_account/account/profile')({ component: ProfilePage });

function ProfilePage() {
  const { user } = useSession();
  const profile = useQuery({ ...profileQueryOptions(user?.id ?? ''), enabled: user !== null });
  return (
    <>
      <h1 className="text-heading font-bold text-foreground">Perfil do colecionador</h1>
      {profile.data ? (
        <p className="mt-4 text-body text-text-secondary">{profile.data.displayName}</p>
      ) : (
        <div className="mt-6 max-w-md">
          <FormSkeleton fields={3} />
        </div>
      )}
    </>
  );
}
