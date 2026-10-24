import { addNft, prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, login, test } from './fixtures/kurio';

test('menos remove a última unidade do carrinho e mantém limite no detalhe', async ({
  page,
  isMobile,
}) => {
  await page.goto('/nfts/nft-001');
  await expect(
    page.getByRole('button', { name: 'Diminuir quantidade' }).filter({ visible: true }),
  ).toBeDisabled();
  await addNft(page, isMobile);
  const decrease = page
    .getByTestId('cart-item')
    .getByRole('button', { name: 'Diminuir quantidade' });
  await expect(decrease).toBeEnabled();
  await decrease.click();
  await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible();
});

test('desconto do lançamento tem o sinal entre parênteses', async ({ page, isMobile }) => {
  await addNft(page, isMobile);
  await expect(page.getByTestId('quote-discount')).toHaveText('(-) 0.00 ETH');
});

test('recomendações navegam por todos os cards e ampliam no hover', async ({ page, isMobile }) => {
  test.skip(isMobile, 'A seção de recomendações do carrinho pertence ao frame desktop');
  await addNft(page, isMobile);
  const section = page.getByRole('region', { name: 'Colecionadores também viram' });
  const track = section.getByRole('list', { name: 'Colecionadores também viram' });
  await expect(track.locator(':scope > li')).toHaveCount(11);
  const first = track.locator(':scope > li').first();
  await first.hover();
  await expect(first).toHaveCSS('scale', '1.04');
  await section.getByRole('button', { name: 'Próximas recomendações' }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100);
  await section.getByRole('button', { name: 'Ir para página 1 das recomendações' }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThan(2);
});

for (const viewport of [
  { width: 1440, height: 768 },
  { width: 1024, height: 600 },
  { width: 720, height: 450 },
  { width: 390, height: 844 },
]) {
  test(`autenticação não cria rolagem dentro do formulário em ${viewport.width}x${viewport.height}`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Matriz de tamanhos executada uma vez');
    await page.setViewportSize(viewport);
    for (const route of ['/login', '/register']) {
      await page.goto(route);
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      expect(
        await dialog.evaluate((element) => element.scrollHeight - element.clientHeight),
      ).toBeLessThanOrEqual(1);
      const submit = dialog.locator('button[type="submit"]');
      await submit.scrollIntoViewIfNeeded();
      await expect(submit).toBeInViewport();
      await submit.click();
      await expect(dialog.getByRole('alert').first()).toBeVisible();
      expect(
        await dialog.evaluate((element) => element.scrollHeight - element.clientHeight),
      ).toBeLessThanOrEqual(1);
    }
  });
}

test('resumo do pedido permite revisar itens e taxa no mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'No desktop o resumo já fica expandido');
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Detalhes do pedido', exact: true }).click();
  const summary = page.getByRole('region', { name: 'Resumo do pedido' });
  await expect(summary.getByText('Emerald Ape #042', { exact: true })).toBeVisible();
  await expect(summary.getByTestId('quote-network-fee')).toBeVisible();
  await page.getByRole('button', { name: 'Detalhes do pedido', exact: true }).click();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
  await expect(page.getByRole('button', { name: 'Confirmar compra', exact: true })).toBeEnabled();
});

test('login avisa quando soma dos carrinhos supera estoque', async ({ page, isMobile }) => {
  await login(page, 'ana', '/');
  await addNft(page, isMobile);
  const quantity = page.getByTestId('cart-item').getByRole('spinbutton');
  await quantity.fill('6');
  await expect(page.getByTestId('quote-subtotal')).toHaveText('7.14 ETH');
  await expect(quantity).toBeEnabled();
  await page.goto('/account/profile');
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('/');
  await addNft(page, isMobile);
  await quantity.fill('6');
  await expect(page.getByTestId('quote-subtotal')).toHaveText('7.14 ETH');
  await expect(quantity).toBeEnabled();
  await login(page, 'ana', '/cart');
  await expect(
    page.getByText(
      'Ajustamos as quantidades do carrinho ao estoque disponível e ao limite de 99 unidades por item.',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(quantity).toHaveValue('10');
});
