import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) =>
        count < 2 && (!(error instanceof ApiError) || error.status >= 500 || error.status === 0),
      retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 3000),
    },
    mutations: { retry: false },
  },
});
