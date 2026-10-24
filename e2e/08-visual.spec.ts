import { addFirstNft } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function prepareScreenshot(page: Page): Promise<void> {
  await page.mouse.move(0, 0);
  const dismiss = page.getByRole('button', { name: 'Fechar notificação' });
  if (await dismiss.first().isVisible()) await dismiss.first().click();
  await expect(page.locator('[data-sonner-toast]')).toHaveCount(0, { timeout: 10000 });
  await expect(page.getByTestId('nft-card-skeleton')).toHaveCount(0);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = 'eager';
        if (!image.complete)
          await new Promise<void>((resolve) => {
            image.onload = () => {
              resolve();
            };
            image.onerror = () => {
              resolve();
            };
          });
      }),
    );
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-23T12:00:00.000Z'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('início mantém a composição visual', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-card')).toHaveCount(9);
  await prepareScreenshot(page);
  await expect(page).toHaveScreenshot('inicio.png', { fullPage: true });
});

test('detalhe cabe na tela e mantém compra acessível', async ({ page }) => {
  await page.goto('/nfts/nft_001');
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042', exact: true })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Mais desta coleção' })).toBeVisible();
  await prepareScreenshot(page);
  await expect(page).toHaveScreenshot('detalhe.png', { fullPage: true });
  await page
    .getByRole('button', { name: /^Comprar/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/cart$/);
});

test('carrinho e pagamento preservam composição e largura', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await addFirstNft(page);
  await expect(page.getByRole('link', { name: 'Conectar e finalizar' })).toBeVisible();
  await prepareScreenshot(page);
  await expect(page).toHaveScreenshot('carrinho.png', { fullPage: true });
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeEnabled();
  await prepareScreenshot(page);
  await expect(page).toHaveScreenshot('pagamento.png', { fullPage: true });
});

test('perfil e carteiras não produzem rolagem horizontal', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  for (const path of ['/account/profile', '/account/wallets']) {
    await page.goto(path);
    await expect(page.getByLabel('Nome de exibição', { exact: true })).toBeVisible();
    await prepareScreenshot(page);
  }
});
