// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { createIdempotencyKey, hashPayload } from './idempotency';

describe('idempotência', () => {
  it('mesmo objeto com chaves em ordens diferentes gera o mesmo hash', async () => {
    const first = await hashPayload({ b: 1, a: { d: [1, 2], c: 'x' } });
    const second = await hashPayload({ a: { c: 'x', d: [1, 2] }, b: 1 });

    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });

  it('conteúdo diferente gera hash diferente', async () => {
    expect(await hashPayload({ quantity: 1 })).not.toBe(await hashPayload({ quantity: 2 }));
  });

  it('gera chaves únicas no formato UUID', () => {
    const key = createIdempotencyKey();

    expect(key).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(createIdempotencyKey()).not.toBe(key);
  });
});
