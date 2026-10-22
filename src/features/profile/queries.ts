import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import { profileApi } from './api';

export function profileQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.profile(userId),
    queryFn: ({ signal }) => profileApi.fetch(signal),
    staleTime: 0,
  });
}
