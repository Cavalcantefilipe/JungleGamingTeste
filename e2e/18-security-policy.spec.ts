import { readFileSync } from 'node:fs';

import { z } from 'zod';

import { prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';

const config = z
  .object({
    headers: z.array(
      z.object({
        source: z.string(),
        headers: z.array(z.object({ key: z.string(), value: z.string() })),
      }),
    ),
  })
  .parse(JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')));
const securityHeaders = Object.fromEntries(
  (config.headers.find((entry) => entry.source === '/(.*)')?.headers ?? []).map(
    ({ key, value }) => [key, value],
  ),
);

test('política CSP de produção permite catálogo socket e compra sem violações', async ({
  page,
  isMobile,
}) => {
  await page.route('**/*', async (route) => {
    if (!route.request().isNavigationRequest()) {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), ...securityHeaders } });
  });
  await page.addInitScript(() => {
    const violations: string[] = [];
    Reflect.set(window, '__kurioCspViolations', violations);
    document.addEventListener('securitypolicyviolation', (event) => {
      violations.push(event.effectiveDirective);
    });
  });
  const response = await page.goto('/');
  expect(response?.headers()['content-security-policy']).toContain("script-src 'self'");
  await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
  const violations = () =>
    page.evaluate(() => {
      const entries: unknown = Reflect.get(window, '__kurioCspViolations');
      return Array.isArray(entries) ? entries.map(String) : [];
    });
  expect(await violations()).toEqual([]);
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  expect(await violations()).toEqual([]);
});
