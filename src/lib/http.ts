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
function activeAuthorization() {
  const session = sessionStorage.read();
  return session ? `Bearer ${session.token}` : false;
}
http.interceptors.request.use((config) => {
  const authorization = activeAuthorization();
  if (config.headers.has('Authorization') && config.headers.get('Authorization') !== authorization)
    throw new ApiError('UNAUTHENTICATED', 401);
  config.headers.set('Authorization', authorization);
  return config;
});
http.interceptors.response.use(
  (response) => {
    if (response.config.headers.get('Authorization') !== activeAuthorization())
      throw new ApiError('UNAUTHENTICATED', 401);
    return response;
  },
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
    const activeToken = sessionStorage.read()?.token;
    const requestAuthorization = error.config?.headers.get('Authorization');
    if (
      normalized.status === 401 &&
      code !== 'INVALID_CREDENTIALS' &&
      activeToken &&
      requestAuthorization === `Bearer ${activeToken}`
    )
      unauthorized?.();
    return Promise.reject(normalized);
  },
);
export type ApiRequestConfig = AxiosRequestConfig & { userId?: string | null };

export async function apiRequest<T>(schema: z.ZodType<T>, options: ApiRequestConfig): Promise<T> {
  const { userId, ...config } = options;
  const session = sessionStorage.read();
  if (userId !== undefined && (session?.user.id ?? null) !== userId)
    throw new ApiError('UNAUTHENTICATED', 401);
  const bound = axios.mergeConfig(config, {
    ...config,
    headers: { Authorization: session ? `Bearer ${session.token}` : false },
  });
  const response = await http.request<unknown>(bound);
  const active = sessionStorage.read();
  if (active?.token !== session?.token || active?.user.id !== session?.user.id)
    throw new ApiError('UNAUTHENTICATED', 401);
  return schema.parse(response.status === 204 ? undefined : response.data);
}
