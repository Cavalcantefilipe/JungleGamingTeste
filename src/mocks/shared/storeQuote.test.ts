import { performance } from 'node:perf_hooks';
import { stdout } from 'node:process';

import { beforeEach, expect, it } from 'vitest';

import { mockStore } from '@/mocks/db/store';

import { computeQuote } from './pricing';
import { storeQuote } from './storeQuote';

const input = {
  items: [{ nftId: 'nft-001', editionId: 'nft-001-10', quantity: 1 }],
  network: 'ethereum' as const,
};
beforeEach(() => {
  mockStore.reset();
});
it('remove mil cotações expiradas sem afetar cálculo ou próximas consultas', () => {
  const expired = {
    ...computeQuote(mockStore.read(), input),
    expiresAt: new Date(Date.now() - 1).toISOString(),
  };
  mockStore.write((db) => ({
    ...db,
    quotes: Object.fromEntries(
      Array.from({ length: 1000 }, (_, index) => [
        String(index),
        { ...expired, id: String(index) },
      ]),
    ),
  }));
  const beforeBytes = new TextEncoder().encode(
    localStorage.getItem('kurio.mockdb.v1') ?? '',
  ).length;
  const first = storeQuote(input);
  const afterBytes = new TextEncoder().encode(localStorage.getItem('kurio.mockdb.v1') ?? '').length;
  expect(first.total).toBe('1.206');
  expect(Object.keys(mockStore.read().quotes)).toHaveLength(1);
  expect(afterBytes).toBeLessThan(beforeBytes / 2);
  const samples = Array.from({ length: 100 }, () => {
    const started = performance.now();
    expect(storeQuote(input).total).toBe('1.206');
    return performance.now() - started;
  }).sort((first, second) => first - second);
  stdout.write(
    `MOCK_DB_BENCHMARK ${JSON.stringify({
      nfts: mockStore.read().nfts.length,
      expiredQuotes: 1000,
      samples: samples.length,
      beforeBytes,
      afterBytes,
      meanMs: samples.reduce((sum, value) => sum + value, 0) / samples.length,
      p95Ms: samples[94],
      maxMs: samples.at(-1),
    })}\n`,
  );
});
