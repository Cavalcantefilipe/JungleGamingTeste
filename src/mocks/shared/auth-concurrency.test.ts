import { beforeEach, describe, expect, it } from 'vitest';

import { mockStore } from '@/mocks/db/store';
import { setScenario } from '@/mocks/scenarios/current';

import { login, register } from './auth';
import { MockError } from './respond';

beforeEach(() => {
  mockStore.reset();
  setScenario('default');
});
describe('concorrência de conta', () => {
  it('rajada de logins não perde o contador nem ultrapassa o limite', async () => {
    const results = await Promise.allSettled(
      Array.from({ length: 20 }, () => login({ email: 'ana@kurio.test', password: 'errada' })),
    );
    const invalid = results.filter(
      (result) =>
        result.status === 'rejected' &&
        result.reason instanceof MockError &&
        result.reason.code === 'INVALID_CREDENTIALS',
    );
    const limited = results.filter(
      (result) =>
        result.status === 'rejected' &&
        result.reason instanceof MockError &&
        result.reason.code === 'TOO_MANY_ATTEMPTS',
    );
    expect(invalid).toHaveLength(5);
    expect(limited).toHaveLength(15);
    expect(mockStore.read().loginAttempts['ana@kurio.test']?.count).toBe(5);
  });
  it('cadastros concorrentes mantêm unicidade de e-mail e nome', async () => {
    const input = {
      username: 'concorrente',
      email: 'concorrente@kurio.test',
      password: 'Kurio!2026',
    };
    const results = await Promise.allSettled(Array.from({ length: 8 }, () => register(input)));
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(mockStore.read().users.filter((entry) => entry.user.email === input.email)).toHaveLength(
      1,
    );
  });
});
