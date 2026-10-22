import { QueryClient } from '@tanstack/react-query';

import { isApiError } from '@/lib/errors';

const MAX_READ_RETRIES = 2;
const GC_TIME_MS = 5 * 60 * 1000;
const RETRY_BASE_MS = 1000;
const RETRY_MAX_MS = 4000;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_READ_RETRIES) return false;
  if (!isApiError(error)) return true;
  if (error.code === 'TIMEOUT' || error.code === 'NETWORK_ERROR') return true;
  return error.status === null || error.status >= 500;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: GC_TIME_MS,
        retry: shouldRetry,
        retryDelay: (attempt) => Math.min(RETRY_BASE_MS * 2 ** attempt, RETRY_MAX_MS),
        refetchOnWindowFocus: true,
      },
      mutations: { retry: 0 },
    },
  });
}
