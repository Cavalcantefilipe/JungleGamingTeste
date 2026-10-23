import '@/lib/configureValidation';

import { z } from 'zod';

const booleanFromString = z
  .enum(['true', 'false'])
  .default('true')
  .transform((value) => value === 'true');

const rawEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default('/api'),
  VITE_SOCKET_URL: z.string().min(1).default('wss://realtime.kurio.app'),
  VITE_ENABLE_MOCKS: booleanFromString,
  VITE_MOCK_SCENARIO: z.string().min(1).default('default'),
});

export interface Env {
  readonly apiBaseUrl: string;
  readonly socketUrl: string;
  readonly enableMocks: boolean;
  readonly mockScenario: string;
}

export function parseEnv(raw: Record<string, unknown>): Env {
  const result = rawEnvSchema.safeParse(raw);
  if (!result.success) {
    const invalidKeys = result.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`Variáveis de ambiente inválidas: ${invalidKeys}`);
  }
  return {
    apiBaseUrl: result.data.VITE_API_BASE_URL,
    socketUrl: result.data.VITE_SOCKET_URL,
    enableMocks: result.data.VITE_ENABLE_MOCKS,
    mockScenario: result.data.VITE_MOCK_SCENARIO,
  };
}

export const env: Env = parseEnv(import.meta.env);
