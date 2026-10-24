import { queryOptions, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session-store';
import { getWallets } from '@/features/wallets/api';
import { queryKeys } from '@/lib/query-keys';

export function walletsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.wallets(userId),
    queryFn: ({ signal }) => getWallets(userId, signal),
    enabled: Boolean(userId),
  });
}
export function useWalletsQuery() {
  const session = useSession();
  return useQuery(walletsQueryOptions(session?.user.id ?? ''));
}
