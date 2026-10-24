import { addNft } from './fixtures/checkout';
import { expect, login, test } from './fixtures/kurio';

import type { Locator } from '@playwright/test';

async function bounds(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  });
  expect(box.width).toBeGreaterThan(0);
  expect(box.height).toBeGreaterThan(0);
  return box;
}

test('catálogo reserva exatamente o espaço dos cards em rede lenta', async ({ page }) => {
  await page.goto('/?scenario=slow-network');
  const before = await bounds(page.getByLabel('Carregando NFT', { exact: true }).first());
  const card = page.getByTestId('nft-grid').locator('article').first();
  await expect(card).toBeVisible();
  const after = await bounds(card);
  for (const dimension of ['x', 'y', 'width', 'height'] as const)
    expect(Math.abs(after[dimension] - before[dimension]), dimension).toBeLessThanOrEqual(2);
});

test('detalhe reserva posição e tamanho da galeria em rede lenta', async ({ page }) => {
  await page.goto('/nfts/nft-001?scenario=slow-network');
  const before = await bounds(page.getByTestId('gallery-skeleton'));
  await expect(page.getByTestId('gallery-image')).toBeVisible();
  const after = await bounds(page.getByTestId('gallery-frame'));
  for (const dimension of ['x', 'y', 'width', 'height'] as const)
    expect(Math.abs(after[dimension] - before[dimension]), dimension).toBeLessThanOrEqual(2);
});

test('detalhe reserva as seções inferiores e não desloca um rodapé visível ao carregar', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Viewport desktop da auditoria Lighthouse');
  await page.setViewportSize({ width: 1335, height: 940 });
  await page.goto('/nfts/nft-001?scenario=slow-network');
  await expect(page.getByLabel('Carregando detalhes', { exact: true })).toBeVisible();
  const before = await bounds(page.getByRole('contentinfo'));
  expect(before.y).toBeGreaterThanOrEqual(940);
  await expect(page.getByTestId('gallery-image')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Mais desta coleção', exact: true })).toBeVisible();
  const after = await bounds(page.getByRole('contentinfo'));
  expect(after.y).toBeGreaterThanOrEqual(940);
});

test('resumo reserva altura e posição durante cálculo lento', async ({ page, isMobile }) => {
  await addNft(page, isMobile);
  await page.evaluate(() => {
    window.__kurio.setScenario('slow-network');
  });
  await page.reload();
  const before = await bounds(page.getByLabel('Carregando resumo', { exact: true }));
  await expect(page.getByTestId('quote-total')).toBeVisible();
  const after = await bounds(page.getByTestId('quote-total').locator('..'));
  for (const dimension of ['x', 'y', 'width', 'height'] as const)
    expect(Math.abs(after[dimension] - before[dimension]), dimension).toBeLessThanOrEqual(2);
});

test('falha transitória mostra erro e nova tentativa recupera o catálogo', async ({ page }) => {
  await page.goto('/?scenario=server-error-reads');
  const error = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar' });
  await expect(error).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.setScenario('default');
  });
  await error.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
  await expect(error).toHaveCount(0);
});

test('reduced-motion desativa a animação dos skeletons', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?scenario=slow-network');
  const skeleton = page.locator('[data-slot="skeleton"]').first();
  await expect(skeleton).toBeVisible();
  await expect(skeleton).toHaveCSS('animation-name', 'none');
});

test('validação lenta da sessão mantém feedback de rota privada', async ({ page }) => {
  await login(page);
  await page.evaluate(() => {
    window.__kurio.setScenario('slow-network');
  });
  await page.reload();
  await expect(page.getByRole('status', { name: 'Carregando página' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Perfil do colecionador', exact: true }),
  ).toBeVisible();
});
