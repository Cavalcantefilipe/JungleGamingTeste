import assert from 'node:assert/strict';
import test from 'node:test';

import { ESLint } from 'eslint';

const eslint = new ESLint();

async function lintMessages(source, filePath = 'src/lib/cn.ts') {
  const results = await eslint.lintText(source, { filePath });
  return results.flatMap((result) => result.messages);
}

async function lintRuleIds(source, filePath = 'src/lib/cn.ts') {
  return (await lintMessages(source, filePath)).map((message) => message.ruleId);
}

test('lint rejects type assertions that bypass checking through unknown', async () => {
  const rules = await lintRuleIds('export const count = "text" as unknown as number;');
  assert.ok(rules.includes('no-restricted-syntax'));
});

test('lint rejects dynamic mock imports outside bootstrap and tests', async () => {
  for (const source of ['@/mocks/control', '../mocks/control', '../../mocks/control']) {
    const messages = await lintMessages(`export const load = () => import('${source}');`);
    assert.ok(
      messages.some(({ message }) => message.includes('Mocks só entram')),
      source,
    );
  }
});

test('lint rejects static template imports that bypass source restrictions', async () => {
  const mockMessages = await lintMessages('export const load = () => import(`@/mocks/control`);');
  assert.ok(mockMessages.some(({ message }) => message.includes('Mocks só entram')));
  const relativeMessages = await lintMessages('export const load = () => import(`./errors`);');
  assert.ok(relativeMessages.some(({ message }) => message.includes('imports absolutos')));
});

test('lint requires absolute paths in import types', async () => {
  const messages = await lintMessages('export type Failure = import("./errors").ApiError;');
  assert.ok(messages.some(({ message }) => message.includes('imports absolutos')));
});

test('lint rejects mock dependencies through import types', async () => {
  const messages = await lintMessages('export type Database = import("@/mocks/db/schema").MockDb;');
  assert.ok(messages.some(({ message }) => message.includes('Mocks só entram')));
});

test('HTTP client exception only permits axios, not mock imports', async () => {
  const rules = await lintRuleIds(
    "import { mockControl } from '@/mocks/control'; export const control = mockControl;",
    'src/lib/http.ts',
  );
  assert.ok(rules.includes('no-restricted-imports'));
});

test('lint continues to reject static mock imports outside bootstrap and tests', async () => {
  const rules = await lintRuleIds(
    "import { mockControl } from '@/mocks/control'; export const control = mockControl;",
  );
  assert.ok(rules.includes('no-restricted-imports'));
});

test('lint permits dynamic mock imports in bootstrap, mocks and tests', async () => {
  for (const filePath of ['src/app/main.tsx', 'src/mocks/browser.ts', 'src/lib/cn.test.ts']) {
    const rules = await lintRuleIds(
      "export const load = () => import('@/mocks/control');",
      filePath,
    );
    assert.ok(!rules.includes('no-restricted-syntax'), filePath);
  }
});

test('lint requires absolute imports and re-exports inside src', async () => {
  for (const source of [
    "import { errorMessage } from './errors'; export const message = errorMessage(null);",
    "export { errorMessage } from './errors';",
    "export * from './errors';",
    "export const load = () => import('./errors');",
  ]) {
    const rules = await lintRuleIds(source);
    assert.ok(rules.includes('no-restricted-syntax'), source);
  }
});

test('lint allows absolute source imports', async () => {
  const rules = await lintRuleIds(
    "import { errorMessage } from '@/lib/errors'; export const message = errorMessage(null);",
  );
  assert.ok(!rules.includes('no-restricted-syntax'));
});
