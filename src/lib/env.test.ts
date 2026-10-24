import { describe, expect, it } from 'vitest';

import { parseEnv } from '@/lib/env';

const validRawEnv = {
  VITE_API_BASE_URL: '/api',
  VITE_SOCKET_URL: 'wss://realtime.kurio.app',
  VITE_ENABLE_MOCKS: 'true',
  VITE_MOCK_SCENARIO: 'default',
};

describe('parseEnv', () => {
  it('lança erro legível quando VITE_API_BASE_URL está vazio', () => {
    expect(() => parseEnv({ ...validRawEnv, VITE_API_BASE_URL: '' })).toThrow(/VITE_API_BASE_URL/);
  });

  it('parseia enableMocks "true" e "false" como booleano', () => {
    expect(parseEnv({ ...validRawEnv, VITE_ENABLE_MOCKS: 'true' }).enableMocks).toBe(true);
    expect(parseEnv({ ...validRawEnv, VITE_ENABLE_MOCKS: 'false' }).enableMocks).toBe(false);
  });

  it('usa os padrões quando a variável não está definida', () => {
    const env = parseEnv({});

    expect(env).toEqual({
      apiBaseUrl: '/api',
      socketUrl: 'wss://realtime.kurio.app',
      enableMocks: true,
      mockScenario: 'default',
    });
  });
});
