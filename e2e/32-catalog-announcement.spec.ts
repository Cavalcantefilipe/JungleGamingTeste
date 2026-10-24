import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

const resultAnnouncement = (page: Page) =>
  page.locator('[aria-live="polite"]').filter({ hasText: /NFTs? encontrad/ });

test('abrir e recarregar catálogo com filtros não anuncia contagem inicial', async ({ page }) => {
  await page.goto('/?q=Cosmic&scenario=slow-network');
  await expect(page.getByLabel('Carregando NFT').first()).toBeVisible();
  await expect(resultAnnouncement(page)).toHaveCount(0);
  await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Cosmic');
  await expect(resultAnnouncement(page)).toHaveCount(0);
  await expect(page.getByText('5 NFTs encontrados', { exact: true })).toHaveCount(1);
  await page.reload();
  await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Cosmic');
  await expect(resultAnnouncement(page)).toHaveCount(0);
});

test('busca e retorno aos filtros iniciais anunciam resultados sem duplicar a contagem', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  await expect(resultAnnouncement(page)).toHaveCount(0);
  await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Cosmic Bloom');
  await expect(resultAnnouncement(page)).toHaveText('5 NFTs encontrados');
  await expect(page.getByText('5 NFTs encontrados', { exact: true })).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('');
  await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
  await page.getByRole('button', { name: 'Página 2', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
  await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('inexistente');
  await expect(resultAnnouncement(page)).toHaveText('0 NFTs encontrados');
});

test('filtro acionado pelo rodapé também anuncia o resultado', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-grid')).toBeVisible();
  await page
    .getByRole('contentinfo')
    .getByRole('link', { name: 'Arte digital', exact: true })
    .click();
  await expect(page).toHaveURL(/category=arte-digital/);
  await expect(resultAnnouncement(page)).toContainText('NFTs encontrados');
});

test('normalização automática de página inicial não anuncia a contagem', async ({ page }) => {
  await page.goto('/?page=999');
  await expect(page).toHaveURL(/page=6/);
  await expect(page.getByText('48 NFTs encontrados', { exact: true })).toHaveCount(1);
  await expect(resultAnnouncement(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Página 5', exact: true }).click();
  await expect(page).toHaveURL(/page=5/);
  await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
});

test('catálogo retomado do cache mantém contagem acessível sem anúncio inicial', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  await page.getByTestId('nft-grid').getByRole('link').first().click();
  await expect(page.getByTestId('gallery-image')).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  await expect(page.getByText('48 NFTs encontrados', { exact: true })).toHaveCount(1);
  await expect(resultAnnouncement(page)).toHaveCount(0);
});

test('erro inicial não informa zero resultados e mantém recuperação acessível', async ({
  page,
}) => {
  await page.goto('/?scenario=server-error-reads');
  const error = page.getByRole('tabpanel').getByRole('alert');
  await expect(error).toBeVisible();
  await expect(page.getByText('0 NFTs encontrados', { exact: true })).toHaveCount(0);
  await expect(resultAnnouncement(page)).toHaveCount(0);
  await page.evaluate(() => {
    window.__kurio.setScenario('default');
  });
  await error.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  await expect(page.getByText('48 NFTs encontrados', { exact: true })).toHaveCount(1);
  await expect(resultAnnouncement(page)).toHaveCount(0);
});
