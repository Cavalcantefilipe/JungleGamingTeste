import { queryOptions, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { getProfile } from './api';

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
