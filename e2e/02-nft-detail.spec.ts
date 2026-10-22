import { test, expect } from './fixtures/kurio';

test('detalhe por acesso direto mostra skeleton e dados da API', async ({ page }) => {
  await page.goto('/nfts/nft-001?scenario=slow-network');
  await expect(page.getByLabel('Carregando detalhes')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042', exact: true })).toBeVisible();
  await expect(
    page.getByRole('img', { name: 'Ilustração de Emerald Ape #042', exact: true }).first(),
  ).toBeVisible();
});
test('NFT inexistente mostra estado 404 do detalhe', async ({ page }) => {
  await page.goto('/nfts/inexistente');
  await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible();
});
test('edição esgotada é desabilitada e quantidade respeita estoque', async ({ page }) => {
  await page.goto('/nfts/nft-001');
  await expect(page.getByRole('button', { name: /1\/1.*Esgotada/ })).toBeDisabled();
  const increase = page.getByRole('button', { name: 'Aumentar quantidade' });
  for (let count = 0; count < 9; count++) await increase.click();
  await expect(page.getByRole('spinbutton', { name: 'Quantidade', exact: true })).toHaveValue('10');
  await expect(increase).toBeDisabled();
});
test('compra adiciona ao carrinho e navega após resposta da API', async ({ page, isMobile }) => {
  await page.goto('/nfts/nft-001');
  await page
    .getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true })
    .click();
  await expect(page).toHaveURL(/\/cart/);
  if (isMobile) await expect(page.getByTestId('cart-item')).toHaveCount(1);
  else
    await expect(page.getByRole('link', { name: 'Carrinho, 1 item', exact: true })).toBeVisible();
});
test('mobile mostra barra fixa de compra', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/nfts/nft-001');
  const bar = page.getByTestId('mobile-purchase-bar');
  await expect(bar.getByRole('button', { name: 'Comprar NFT', exact: true })).toBeVisible();
  const box = await bar.boundingBox();
  expect(box && box.y + box.height).toBeLessThanOrEqual(844);
});
