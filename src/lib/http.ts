import axios, { type AxiosResponse } from 'axios';

import { env } from './env';
import { toApiError, type ApiError } from './errors';

import type { z } from 'zod';

export const HTTP_TIMEOUT_MS = 6000;

export interface HttpAuthHooks {
  getToken: () => string | null;
  onUnauthorized: (error: ApiError) => void;
}

let authHooks: HttpAuthHooks = { getToken: () => null, onUnauthorized: () => undefined };

export function configureHttpAuth(hooks: HttpAuthHooks): void {
  authHooks = hooks;
}

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: HTTP_TIMEOUT_MS,
  headers: { Accept: 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = authHooks.getToken();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

const SESSION_ERROR_CODES = new Set(['SESSION_EXPIRED', 'UNAUTHENTICATED']);

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error as Error);
    const apiError = toApiError(error);
    if (SESSION_ERROR_CODES.has(apiError.code)) authHooks.onUnauthorized(apiError);
    return Promise.reject(apiError);
  },
);

export function parseWith<T>(schema: z.ZodType<T>) {
  return (response: AxiosResponse<unknown>): T => schema.parse(response.data);
}
