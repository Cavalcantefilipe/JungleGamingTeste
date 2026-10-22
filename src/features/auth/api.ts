import { queryOptions } from '@tanstack/react-query';

import { sessionInfoSchema, sessionSchema, type LoginInput, type RegisterInput } from '@/contracts';
import { http, parseWith } from '@/lib/http';
import { queryKeys } from '@/lib/query-keys';

const SESSION_STALE_MS = 60_000;

export const authApi = {
  login: (input: LoginInput) => http.post('/auth/login', input).then(parseWith(sessionSchema)),
  register: (input: RegisterInput) =>
    http.post('/auth/register', input).then(parseWith(sessionSchema)),
  fetchSession: (signal?: AbortSignal) =>
    http.get('/auth/session', signal ? { signal } : {}).then(parseWith(sessionInfoSchema)),
  logout: () => http.post('/auth/logout').then(() => undefined),
};

export const sessionQueryOptions = queryOptions({
  queryKey: queryKeys.session,
  queryFn: ({ signal }) => authApi.fetchSession(signal),
  staleTime: SESSION_STALE_MS,
  retry: false,
});
