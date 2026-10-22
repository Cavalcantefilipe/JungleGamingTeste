import axios, { type AxiosRequestConfig } from 'axios';

import { sessionSchema } from '@/contracts/auth';
import { env } from '@/lib/env';
import { ApiError, errorEnvelopeSchema } from '@/lib/errors';
import { createStorage } from '@/lib/storage';

import type { z } from 'zod';

const sessionStorage = createStorage('kurio.session', sessionSchema);
let unauthorized: (() => void) | undefined;
export function onUnauthorized(listener: () => void): void {
  unauthorized = listener;
}
export const http = axios.create({ baseURL: env.apiBaseUrl, timeout: 6000 });
http.interceptors.request.use((config) => {
  const session = sessionStorage.read();
  if (session) config.headers.set('Authorization', `Bearer ${session.token}`);
  return config;
});
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error))
      return Promise.reject(error instanceof Error ? error : new Error('Falha HTTP'));
    const parsed = errorEnvelopeSchema.safeParse(error.response?.data);
    const code = parsed.success
      ? parsed.data.error.code
      : error.code === 'ECONNABORTED'
        ? 'TIMEOUT'
        : 'NETWORK';
    const normalized = new ApiError(
      code,
      error.response?.status ?? 0,
      parsed.success ? parsed.data.error.fields : undefined,
    );
    if (normalized.status === 401 && code !== 'INVALID_CREDENTIALS') unauthorized?.();
    return Promise.reject(normalized);
  },
);
export async function apiRequest<T>(schema: z.ZodType<T>, config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<unknown>(config);
  return schema.parse(response.status === 204 ? undefined : response.data);
}
