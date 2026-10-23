import assert from 'node:assert/strict';
import { test } from 'node:test';

import { assertThresholds, summarize } from './metrics.mjs';

function report(score, lcp) {
  return {
    categories: Object.fromEntries(
      ['performance', 'accessibility', 'best-practices', 'seo'].map((name) => [name, { score }]),
    ),
    audits: Object.fromEntries(
      ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time'].map((name) => [
        name,
        { numericValue: lcp },
      ]),
    ),
    environment: { hostUserAgent: 'test-browser' },
  };
}
const assertions = {
  'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
};

test('medianas independentes preservam resultado ruim, sem escolher o melhor run', () => {
  const row = summarize('mobile', 'home', [
    report(1, 5000),
    report(0.89, 3000),
    report(0.88, 4000),
  ]);
  assert.equal(row.performance, 89);
  assert.equal(row.lcpMs, 4000);
  assert.equal(assertThresholds([row], assertions).length, 1);
});
test('meta exata passa, categoria ausente ou inválida não passa silenciosamente', () => {
  const row = summarize(
    'mobile',
    'home',
    Array.from({ length: 3 }, () => report(0.9, 1000)),
  );
  assert.deepEqual(assertThresholds([row], assertions), []);
  assert.throws(() => summarize('mobile', 'home', [{}, {}, {}]));
  assert.throws(() =>
    summarize(
      'mobile',
      'home',
      Array.from({ length: 3 }, () => report(NaN, 1)),
    ),
  );
});
test('coleta incompleta e erro de runtime impedem resumo aprovado', () => {
  assert.throws(() => summarize('mobile', 'home', [report(1, 1)]));
  assert.throws(() =>
    summarize('mobile', 'home', [report(1, 1), report(1, 1), { runtimeError: { code: 'NO_FCP' } }]),
  );
});
test('agregação diferente da mediana é recusada', () => {
  assert.throws(() => assertThresholds([], { 'categories:seo': ['error', { minScore: 0.9 }] }));
});
