import { useQuery } from '@tanstack/react-query';

import { contentSchema } from '@/contracts/content';
import { apiRequest } from '@/lib/http';

export function useContentQuery() {
  return useQuery({
    queryKey: ['content'],
    queryFn: ({ signal }) => apiRequest(contentSchema, { url: '/content', signal }),
    staleTime: Infinity,
  });
}
