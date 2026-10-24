import { queryOptions, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session-store';
import { getProfile } from '@/features/profile/api';
import { queryKeys } from '@/lib/query-keys';

export function profileQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.profile(userId),
    queryFn: ({ signal }) => getProfile(userId, signal),
    enabled: Boolean(userId),
  });
}

export function useProfileQuery() {
  const session = useSession();
  return useQuery(profileQueryOptions(session?.user.id ?? ''));
}
