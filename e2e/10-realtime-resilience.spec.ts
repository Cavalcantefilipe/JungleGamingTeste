import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function waitForRealtime(page: Page): Promise<void> {
  await expect
    .poll(() => page.evaluate(() => window.__kurio?.realtimeConnections() ?? 0))
    .toBeGreaterThan(0);
}

test.describe('resiliência do tempo real', () => {
  test('eventos duplicados e antigos não regridem o estado', async ({ page, kurio }) => {
    await page.goto('/nfts/nft_001');
    await expect(page.getByText('1.19 ETH').first()).toBeVisible();
    await waitForRealtime(page);
    const latest = kurio.nftEvent('nft_001', 3, { price: '3.00', version: 3 });

    await kurio.emit(latest);
    await expect(page.getByText('3.00 ETH').first()).toBeVisible();
    await kurio.emit(latest);
    await kurio.emit(kurio.nftEvent('nft_001', 2, { price: '2.00', version: 2 }));

    await page.waitForTimeout(500);
    await expect(page.getByText('3.00 ETH').first()).toBeVisible();
    await expect(page.getByText('2.00 ETH')).toHaveCount(0);
  });

  test('reconexão reconcilia com a API REST', async ({ page }) => {
    await page.goto('/nfts/nft_001');
    await expect(page.getByText('1.19 ETH').first()).toBeVisible();
    await waitForRealtime(page);

    await page.evaluate(() => {
      window.__kurio?.updateNft('nft_001', { price: '4.00' });
      window.__kurio?.disconnectRealtime();
    });

    await waitForRealtime(page);
    await expect(page.getByText('4.00 ETH').first()).toBeVisible({ timeout: 10_000 });
  });
});
