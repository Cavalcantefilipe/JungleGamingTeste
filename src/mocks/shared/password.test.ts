import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from './password';

describe('senhas do mock', () => {
  it('nunca armazena a senha em claro e usa salt diferente a cada hash', async () => {
    const first = await hashPassword('Kurio!2026');
    const second = await hashPassword('Kurio!2026');

    expect(first.hash).not.toContain('Kurio');
    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });

  it('verifica a senha certa e recusa a errada', async () => {
    const stored = await hashPassword('Kurio!2026');

    expect(await verifyPassword('Kurio!2026', stored)).toBe(true);
    expect(await verifyPassword('kurio!2026', stored)).toBe(false);
  });
});
