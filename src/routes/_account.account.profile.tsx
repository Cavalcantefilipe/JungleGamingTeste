import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ErrorState } from '@/components/feedback/ErrorState';
import { FormSkeleton } from '@/components/feedback/skeletons';
import { useSession } from '@/features/auth/session-store';
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { ProfilePassword } from '@/features/profile/components/ProfilePassword';
import { profileQueryOptions } from '@/features/profile/queries';
import { errorMessage } from '@/lib/errors';

export const Route = createFileRoute('/_account/account/profile')({ component: ProfilePage });

function ProfilePage() {
  const { user } = useSession();
  const profile = useQuery({ ...profileQueryOptions(user?.id ?? ''), enabled: user !== null });
  return (
    <>
      <h1 className="text-body-lg font-bold text-foreground">Perfil do colecionador</h1>
      {profile.data ? (
        <div className="mt-8">
          <ProfileForm profile={profile.data}>
            <ProfileAvatar profile={profile.data} />
          </ProfileForm>
          <ProfilePassword />
        </div>
      ) : (
        <div className="mt-6 max-w-md">
          {profile.isError ? (
            <ErrorState
              description={errorMessage(profile.error)}
              retrying={profile.isFetching}
              onRetry={() => {
                void profile.refetch();
              }}
            />
          ) : (
            <FormSkeleton fields={5} />
          )}
        </div>
      )}
    </>
  );
}
