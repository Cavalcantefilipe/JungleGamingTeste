import { expect, test, type KurioHelpers } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function openFilters(page: Page): Promise<void> {
  const trigger = page.getByRole('button', { name: 'Filtros' });
  if (await trigger.isVisible()) await trigger.click();
}

function cardNames(page: Page) {
  return page.getByTestId('nft-card').getByRole('heading').allTextContents();
}

test.describe('catálogo', () => {
  test('busca e dois filtros combinados refletem na URL e na chamada da API', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('searchbox', { name: 'Buscar NFTs' }).fill('golden');
    await expect(page).toHaveURL(/q=golden/);
    await openFilters(page);
    await page.getByRole('checkbox', { name: /^Música/ }).check();
    const request = page.waitForRequest(
      (candidate) =>
        candidate.url().includes('/api/nfts') &&
        candidate.url().includes('category=musica') &&
        candidate.url().includes('network=polygon'),
    );
    await page.getByRole('checkbox', { name: /^Polygon/ }).check();

    await request;
    await expect(page).toHaveURL(/category=.*musica/);
    await expect(page).toHaveURL(/network=.*polygon/);
  });

  test('mudar filtro reinicia a página para 1', async ({ page }) => {
    await page.goto('/?page=2');
    await expect(page.getByRole('button', { name: 'Página 2', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await openFilters(page);
    await page.getByRole('checkbox', { name: /^Arte digital/ }).check();

    await expect(page).not.toHaveURL(/page=2/);
  });

  test('refresh preserva filtros e página', async ({ page }) => {
    await page.goto('/?page=2&sort=price_asc');
    await openFilters(page);
    await page.getByRole('checkbox', { name: /^Ethereum/ }).check();
    await expect(page).toHaveURL(/network=.*ethereum/);
    const urlBefore = page.url();

    await page.reload();

    expect(page.url()).toBe(urlBefore);
    await expect(page.getByRole('combobox', { name: 'Ordenar por' })).toHaveText(/menor preço/i);
    await openFilters(page);
    await expect(page.getByRole('checkbox', { name: /^Ethereum/ })).toBeChecked();
  });

  test('voltar no histórico restaura o estado anterior', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('searchbox', { name: 'Buscar NFTs' }).fill('ape');
    await expect(page).toHaveURL(/q=ape/);
    await expect(page.getByText('Atualizando resultados…')).toBeHidden();
    const apeNames = await cardNames(page);
    await page.getByRole('searchbox', { name: 'Buscar NFTs' }).fill('nomad');
    await expect(page).toHaveURL(/q=nomad/);
    await expect
      .poll(async () => (await cardNames(page)).every((name) => /nomad/i.test(name)))
      .toBe(true);

    await page.goBack();

    await expect(page).toHaveURL(/q=ape/);
    await expect(page.getByRole('searchbox', { name: 'Buscar NFTs' })).toHaveValue('ape');
    await expect.poll(async () => cardNames(page)).toEqual(apeNames);
  });

  test('resultado vazio mostra estado vazio com limpar filtros', async ({ page }) => {
    await page.goto('/?q=zzzzzz');

    await expect(page.getByText('Nenhum NFT encontrado')).toBeVisible();
    await page.getByRole('button', { name: 'Limpar filtros' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('nft-card').first()).toBeVisible();
  });

  test('erro na API mostra erro e tentar novamente recupera', async ({ page, kurio }) => {
    await kurio.setScenario('server-error-reads', { reload: true });

    await expect(page.getByRole('alert').getByText(/não foi possível carregar/i)).toBeVisible({
      timeout: 15_000,
    });
    await kurio.setScenario('default');
    await page.getByRole('button', { name: 'Tentar novamente' }).click();

    await expect(page.getByTestId('nft-card').first()).toBeVisible();
  });

  test('respostas fora de ordem não sobrescrevem o resultado mais recente', async ({
    page,
    kurio,
  }) => {
    await kurio.setScenario('out-of-order');
    await page.goto('/');
    const search = page.getByRole('searchbox', { name: 'Buscar NFTs' });

    await search.fill('nomad');
    await expect(page).toHaveURL(/q=nomad/);
    await search.fill('golden');
    await expect(page).toHaveURL(/q=golden/);

    await expect
      .poll(
        async () => {
          const names = await cardNames(page);
          return names.length > 0 && names.every((name) => /golden/i.test(name));
        },
        { timeout: 15_000 },
      )
      .toBe(true);
    await page.waitForTimeout(2000);
    expect((await cardNames(page)).every((name) => /golden/i.test(name))).toBe(true);
  });

  test('skeleton aparece em rede lenta com dimensões estáveis', async ({ page, kurio }) => {
    await kurio.setScenario('slow-network');
    await page.goto('/');

    const skeleton = page.getByTestId('nft-card-skeleton').first();
    await expect(skeleton).toBeVisible();
    const skeletonBox = await skeleton.boundingBox();
    const card = page.getByTestId('nft-card').first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    const cardBox = await card.boundingBox();

    expect(Math.round(skeletonBox?.width ?? 0)).toBe(Math.round(cardBox?.width ?? -1));
  });

  test('paginação navega e marca a página atual', async ({ page }) => {
    await page.goto('/');
    const firstPage = await cardNames(page);

    await page.getByRole('button', { name: 'Página 2', exact: true }).click();

    await expect(page).toHaveURL(/page=2/);
    await expect
      .poll(async () => {
        const names = await cardNames(page);
        return names.length === 9 && names[0] !== firstPage[0];
      })
      .toBe(true);
  });
});

export type { KurioHelpers };
