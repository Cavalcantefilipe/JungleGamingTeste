import { prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, login, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function logout(page: Page) {
  await page.goto('/account/profile');
  await page.getByRole('button', { name: 'Abrir menu da conta', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('kurio.session'))).toBeNull();
}
test('cenário desconhecido usa padrão sem prender inicialização', async ({ page }) => {
  await page.goto('/?scenario=unknown-scenario');
  await expect(page.getByTestId('home-hero')).toBeVisible();
  expect(await page.evaluate(() => window.__kurio.getScenario().name)).toBe('default');
});
test('falha ao registrar worker mostra erro acessível e permite tentar novamente', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const register = navigator.serviceWorker.register.bind(navigator.serviceWorker);
    navigator.serviceWorker.register = (...args) => {
      if (!sessionStorage.getItem('kurio.worker.failedOnce')) {
        sessionStorage.setItem('kurio.worker.failedOnce', 'true');
        return Promise.reject(new Error('Falha controlada ao iniciar worker'));
      }
      return register(...args);
    };
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Não foi possível iniciar Kurio');
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(page.getByTestId('home-hero')).toBeVisible();
});
test('logout preserva recuperação por usuário sem mostrar compra de Ana para Bruno', async ({
  page,
  isMobile,
}) => {
  await page.clock.install();
  await prepareCheckout(page, isMobile, 'order-timeout');
  await reviewAndConnect(page);
  const keys: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/orders'))
      keys.push(request.headers()['idempotency-key'] ?? '');
  });
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
  await page.clock.fastForward(6500);
  await expect(page.getByRole('button', { name: 'Recuperar pedido', exact: true })).toBeVisible();
  const pending = await page.evaluate(() => localStorage.getItem('kurio.pendingOrder.user-ana'));
  expect(pending).not.toBeNull();
  await logout(page);
  expect(await page.evaluate(() => localStorage.getItem('kurio.pendingOrder.user-ana'))).toBe(
    pending,
  );
  await login(page, 'bruno', '/checkout');
  await expect(page.getByRole('button', { name: 'Recuperar pedido', exact: true })).toHaveCount(0);
  await expect(page.getByTestId('order-items')).toHaveCount(0);
  await logout(page);
  await login(page, 'ana', '/checkout');
  await page.getByRole('button', { name: 'Recuperar pedido', exact: true }).click();
  await expect(page).toHaveURL(/\/orders\//);
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
  expect(keys.length).toBeGreaterThanOrEqual(2);
  expect(new Set(keys).size).toBe(1);
});
