import { openCollector, prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';
import { createOrderInputSchema } from '../src/contracts/order';

test('nome de usuário permanece no rascunho e no snapshot enviado do pedido', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile);
  await openCollector(page, isMobile);
  await page.getByLabel('Nome de usuário', { exact: true }).fill('ana_colecionadora');
  await page.reload();
  await openCollector(page, isMobile);
  await expect(page.getByLabel('Nome de usuário', { exact: true })).toHaveValue(
    'ana_colecionadora',
  );
  await reviewAndConnect(page);
  const sent = page.waitForRequest(
    (request) => request.method() === 'POST' && request.url().endsWith('/api/orders'),
  );
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  const payload = createOrderInputSchema.parse((await sent).postDataJSON());
  expect(payload.collector.username).toBe('ana_colecionadora');
  await expect(page).toHaveURL(/\/orders\//);
  expect(await page.evaluate(() => window.__kurio.getState().orders[0]?.collector?.username)).toBe(
    'ana_colecionadora',
  );
});

test('atalho de cupom volta ao carrinho e retorna ao pagamento com o rascunho', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile);
  await openCollector(page, isMobile);
  await page.getByLabel('Nome de exibição', { exact: true }).fill('Ana compradora');
  if (isMobile) await page.getByRole('button', { name: 'Detalhes do pedido', exact: true }).click();
  await page.getByRole('link', { name: 'Aplique aqui', exact: true }).click();
  await expect(page).toHaveURL(/\/cart#coupon-code$/);
  await page.getByLabel('Código promocional', { exact: true }).fill('LANCAMENTO10');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect(page.getByTestId('quote-discount')).toHaveText('(-) 0.119 ETH');
  await page.getByRole('link', { name: 'Conectar e finalizar', exact: true }).click();
  await openCollector(page, isMobile);
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue('Ana compradora');
  if (isMobile) await page.getByRole('button', { name: 'Detalhes do pedido', exact: true }).click();
  await expect(page.getByTestId('quote-discount')).toHaveText('(-) 0.119 ETH');
});

test('token real aparece no resumo e permanece imutável no recibo', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  if (isMobile) await page.getByRole('button', { name: 'Detalhes do pedido', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Resumo do pedido' })).toContainText(
    'ID do token: #0042',
  );
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  const receipt = page.getByRole('dialog');
  await expect(receipt).toBeVisible();
  await expect(receipt).toContainText('ID do token: #0042');
  await expect(receipt).toContainText('Edição 1/10');
  await page.evaluate(() => {
    const state = window.__kurio.getState();
    localStorage.setItem(
      'kurio.mockdb.v1',
      JSON.stringify({
        ...state,
        nfts: state.nfts.map((nft) => (nft.id === 'nft-001' ? { ...nft, tokenId: '9999' } : nft)),
      }),
    );
  });
  await page.reload();
  await expect(receipt).toContainText('ID do token: #0042');
  await expect(receipt).not.toContainText('#9999');
});
