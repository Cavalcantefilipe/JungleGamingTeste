import { expect } from './kurio';

import type { Page } from '@playwright/test';

export async function addFirstNft(page: Page): Promise<void> {
  await page.goto('/nfts/nft_001');
  await page.getByRole('radio', { name: /^1\/50/ }).click();
  await page
    .getByRole('button', { name: /^Comprar/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole('list', { name: 'Itens do carrinho' })).toContainText(
    'Emerald Ape #042',
  );
}

export async function openCheckout(page: Page): Promise<void> {
  await addFirstNft(page);
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeEnabled();
  if ((page.viewportSize()?.width ?? 0) < 768) {
    await page.getByRole('button', { name: 'Perfil do colecionador' }).click();
    await page.getByRole('button', { name: 'Resumo do pedido', exact: true }).click();
  }
}

export async function loginFromForm(page: Page): Promise<void> {
  await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
}
