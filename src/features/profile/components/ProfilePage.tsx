import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountLayout } from '@/features/account/components/AccountLayout';

import { useProfileQuery } from '../queries';
import { PasswordForm } from './PasswordForm';
import { ProfileForm } from './ProfileForm';

export function ProfilePage() {
  const query = useProfileQuery();
  return (
    <AccountLayout>
      <h1 className="mb-8 text-base font-bold">Perfil do colecionador</h1>
      {query.isPending ? (
        <Skeleton aria-label="Carregando perfil" className="h-[560px] w-full" />
      ) : query.isError ? (
        <ErrorState
          error={query.error}
          retry={() => {
            void query.refetch();
          }}
        />
      ) : (
        <>
          <ProfileForm key={query.data.id} profile={query.data} />
          <PasswordForm />
        </>
      )}
    </AccountLayout>
  );
}
