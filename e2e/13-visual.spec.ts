import { prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function stabilize(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map(async (image) => {
        image.loading = 'eager';
        if (image.complete) return;
        await new Promise<void>((resolve) => {
          image.addEventListener(
            'load',
            () => {
              resolve();
            },
            { once: true },
          );
          image.addEventListener(
            'error',
            () => {
              resolve();
            },
            { once: true },
          );
        });
      }),
    );
  });
  await page.mouse.move(0, 0);
  await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
  await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.setFixedTime(new Date('2026-07-29T12:00:00Z'));
  await page.goto('/');
  await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
  await page.evaluate(() => {
    window.__kurio.reset('default');
  });
});

test('Início mantém composição aprovada', async ({ page }) => {
  await page.reload();
  await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
  await stabilize(page);
  await expect(page).toHaveScreenshot('home.png', { fullPage: true, animations: 'disabled' });
});

test('Detalhe mantém composição aprovada', async ({ page }) => {
  await page.goto('/nfts/nft-001');
  await expect(page.getByTestId('gallery-image')).toBeVisible();
  await stabilize(page);
  await expect(page).toHaveScreenshot('detail.png', { fullPage: true, animations: 'disabled' });
});

test('Avaliações mantêm composição e legibilidade', async ({ page }) => {
  await page.goto('/nfts/nft-004?tab=reviews&reviewPage=1');
  const panel = page.getByRole('tabpanel');
  await expect(panel.getByRole('article')).toHaveCount(4);
  await stabilize(page);
  await expect(panel).toHaveScreenshot('reviews.png', { animations: 'disabled' });
});

test('Carrinho mantém composição aprovada', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await page.goto('/cart');
  await expect(page.getByTestId('quote-total')).toBeVisible();
  await stabilize(page);
  await expect(page).toHaveScreenshot('cart.png', { fullPage: true, animations: 'disabled' });
});

test('Pagamento mantém composição aprovada', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await stabilize(page);
  await expect(page).toHaveScreenshot('payment.png', { fullPage: true, animations: 'disabled' });
});
