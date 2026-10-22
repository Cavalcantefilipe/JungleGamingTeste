import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function waitForRealtime(page: Page): Promise<void> {
  await expect
    .poll(() => page.evaluate(() => window.__kurio?.realtimeConnections() ?? 0))
    .toBeGreaterThan(0);
}

test.describe('tempo real', () => {
  test('preço muda via socket no detalhe e atualiza sem recarregar', async ({ page, kurio }) => {
    await page.goto('/nfts/nft_001');
    await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible();
    await expect(page.getByText('1.19 ETH').first()).toBeVisible();
    await waitForRealtime(page);
    const detailRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/nfts/nft_001')) detailRequests.push(request.url());
    });

    await kurio.emit(kurio.nftEvent('nft_001', 2, { price: '2.50', version: 2 }));

    await expect(page.getByText('2.50 ETH').first()).toBeVisible();
    await expect(page.getByText('Preço de Emerald Ape #042 atualizado')).toBeAttached();
    expect(detailRequests).toHaveLength(0);
  });
});
