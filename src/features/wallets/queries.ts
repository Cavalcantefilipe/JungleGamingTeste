import { queryOptions, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { getWallets } from './api';

export function walletsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.wallets(userId),
    queryFn: ({ signal }) => getWallets(signal),
    enabled: Boolean(userId),
  });
}
export function useWalletsQuery() {
  const session = useSession();
  return useQuery(walletsQueryOptions(session?.user.id ?? ''));
}
