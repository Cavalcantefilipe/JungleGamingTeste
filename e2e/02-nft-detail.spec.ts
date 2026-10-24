import { expect, test } from './fixtures/kurio';

test.describe('detalhe do NFT', () => {
  test('acesso direto por URL renderiza o detalhe com skeleton antes', async ({ page, kurio }) => {
    await kurio.setScenario('slow-network');

    await page.goto('/nfts/nft_001');

    await expect(page.getByTestId('detail-skeleton')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('1.19 ETH').first()).toBeVisible();
  });

  test('NFT inexistente mostra 404 do detalhe', async ({ page }) => {
    await page.goto('/nfts/nao-existe');

    await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible();
    await page.getByRole('link', { name: 'Voltar ao catálogo' }).click();
    await expect(page).toHaveURL(/\/(#catalogo)?$/);
  });

  test('edição esgotada não é selecionável', async ({ page }) => {
    await page.goto('/nfts/nft_006');

    const soldOut = page.getByRole('radio', { name: /1\/1.*esgotada/i });
    await expect(soldOut).toBeDisabled();
    await expect(page.getByRole('radio', { name: /^1\/50/ })).toBeEnabled();
  });

  test('stepper não passa do disponível', async ({ page }) => {
    await page.goto('/nfts/nft_002');
    await page.getByRole('radio', { name: /^1\/10/ }).click();
    const quantity = page.getByRole('spinbutton', { name: 'Quantidade' });
    const increase = page.getByRole('button', { name: 'Aumentar quantidade' });

    await increase.click();

    await expect(quantity).toHaveValue('2');
    await expect(increase).toBeDisabled();
    await expect(page.getByText('2 disponíveis')).toBeVisible();
  });

  test('mobile mostra barra inferior fixa com Comprar NFT', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith('mobile'), 'barra fixa só existe no mobile');
    await page.goto('/nfts/nft_001');

    const buy = page.getByRole('button', { name: 'Comprar NFT', exact: true });
    await expect(buy).toBeVisible();
    const position = await buy.evaluate((element) => {
      const bar = element.closest('[data-testid="mobile-purchase-bar"]');
      return bar ? getComputedStyle(bar).position : null;
    });
    expect(position).toBe('fixed');
  });

  test('comprar adiciona ao carrinho e leva para o carrinho', async ({ page }) => {
    await page.goto('/nfts/nft_001');

    await page.getByRole('radio', { name: /^1\/50/ }).click();
    await page.getByRole('button', { name: 'Aumentar quantidade' }).click();
    await page
      .getByRole('button', { name: /^Comprar/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByText('Emerald Ape #042')).toBeVisible();
    await expect(page.getByLabel('2 unidades', { exact: true })).toBeVisible();
  });
});
