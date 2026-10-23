import { expect, login } from './kurio';

import type { Page } from '@playwright/test';

export async function addNft(page: Page, isMobile: boolean, id = 'nft-001') {
  await page.goto(`/nfts/${id}`);
  await page
    .getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true })
    .click();
  await expect(page).toHaveURL(/\/cart/);
}
export async function prepareCheckout(page: Page, isMobile: boolean, scenario = 'default') {
  await login(page, 'ana', '/');
  await addNft(page, isMobile);
  await page.evaluate((name) => {
    window.__kurio.setScenario(name);
  }, scenario);
  await page.getByRole('link', { name: 'Conectar e finalizar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Revisar cotação', exact: true })).toBeVisible();
}
export async function reviewAndConnect(page: Page) {
  await page.getByRole('button', { name: 'Revisar cotação', exact: true }).click();
  await expect(page.getByText('Cotação revisada', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Conectar MetaMask', exact: true }).click();
  await expect(page.getByText('Carteira conectada', { exact: true })).toBeVisible();
}
export async function openCollector(page: Page, isMobile: boolean) {
  if (isMobile)
    await page.getByRole('button', { name: 'Dados do colecionador', exact: true }).click();
}
