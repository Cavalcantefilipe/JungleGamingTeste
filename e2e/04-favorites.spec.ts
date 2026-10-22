import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

function favoriteButton(page: Page, cardIndex: number) {
  return page
    .getByTestId('nft-card')
    .nth(cardIndex)
    .getByRole('button', { name: /favoritos/ });
}

test.describe('favoritos', () => {
  test('favoritar persiste após refresh', async ({ page, kurio }) => {
    await kurio.loginAs('ana');
    await page.goto('/');
    const heart = favoriteButton(page, 1);
    await expect(heart).toHaveAttribute('aria-pressed', 'false');

    const saved = page.waitForResponse(
      (response) =>
        response.url().includes('/api/favorites/') && response.request().method() === 'PUT',
    );
    await heart.click();
    await expect(heart).toHaveAttribute('aria-pressed', 'true');
    await saved;
    await kurio.reload();

    await expect(favoriteButton(page, 1)).toHaveAttribute('aria-pressed', 'true');
  });

  test('falha de mutation reverte o visual e avisa', async ({ page, kurio }) => {
    await kurio.loginAs('ana');
    await kurio.setScenario('favorite-mutation-fails');
    await page.goto('/');
    const heart = favoriteButton(page, 1);

    await heart.click();

    await expect(page.getByText('Não foi possível atualizar favoritos')).toBeVisible();
    await expect(heart).toHaveAttribute('aria-pressed', 'false');
  });

  test('favorito de Ana não aparece para Bruno', async ({ page, kurio }) => {
    await kurio.loginAs('ana');
    await page.goto('/');
    await expect(favoriteButton(page, 0)).toHaveAttribute('aria-pressed', 'true');

    await kurio.loginAs('bruno');
    await page.goto('/');

    await expect(favoriteButton(page, 0)).toHaveAttribute('aria-pressed', 'false');
  });

  test('aba Favoritos lista apenas favoritos', async ({ page, kurio }) => {
    await kurio.loginAs('ana');

    await page.goto('/?favorites=true');

    await expect(page.getByTestId('nft-card')).toHaveCount(3);
    await expect(page.getByText('Emerald Ape #042')).toBeVisible();
    await expect(page.getByText('Mostrando seus favoritos')).toBeVisible();
  });

  test('logout limpa dados privados em cache', async ({ page, kurio }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('mobile'), 'menu de conta do header é desktop');
    await kurio.loginAs('ana');
    await page.goto('/');
    await expect(favoriteButton(page, 0)).toHaveAttribute('aria-pressed', 'true');

    await page
      .getByRole('banner')
      .getByRole('button', { name: /Ana Ribeiro/ })
      .click();
    await page.getByRole('menuitem', { name: 'Sair' }).click();

    await expect(favoriteButton(page, 0)).toHaveAttribute('aria-pressed', 'false');
    await page.goto('/?favorites=true');
    await expect(page).toHaveURL(/\/login\?returnTo=/);
  });

  test('visitante que favorita é levado ao login com retorno', async ({ page }) => {
    await page.goto('/nfts/nft_002');

    await page.getByRole('button', { name: 'Favoritar' }).click();

    await expect(page).toHaveURL(/\/login\?returnTo=%2Fnfts%2Fnft_002/);
  });
});
