import { addNft, openCollector, prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { test, expect, login } from './fixtures/kurio';

test('do catálogo ao recibo confirmado preserva itens adicionados após o pedido', async ({
  page,
  isMobile,
}, testInfo) => {
  await login(page, 'ana', '/');
  await addNft(page, isMobile);
  await addNft(page, isMobile, 'nft-002');
  await page.getByLabel('Código promocional', { exact: true }).fill('LANCAMENTO10');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect(page.getByTestId('quote-discount')).toHaveText('(-) 0.288 ETH');
  await page.getByRole('link', { name: 'Conectar e finalizar', exact: true }).click();
  await openCollector(page, isMobile);
  await page.getByLabel('Nome de exibição', { exact: true }).fill('Ana Colecionadora');
  await reviewAndConnect(page);
  if (isMobile)
    await page.getByRole('button', { name: 'Dados do colecionador', exact: true }).click();
  await expect(page.getByText('NFT adicionado ao carrinho', { exact: true })).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath('payment.png'), fullPage: true });
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(page).toHaveURL(/\/orders\//);
  const order = await page.evaluate(() => window.__kurio.getState().orders[0]);
  expect(order?.total).toBe('2.608');
  if (!order) throw new Error('Pedido não criado');
  await addNft(page, isMobile, 'nft-003');
  await page.goto(`/orders/${order.id}`);
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('ID da transação', { exact: true })).toBeVisible();
  const explorer = page.getByRole('link', { name: 'Ver no Etherscan (simulado)', exact: true });
  await expect(explorer).toHaveAttribute('href', /^https:\/\/etherscan\.io\/tx\/0x/);
  await expect(explorer).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByTestId('order-items').getByRole('row')).toHaveCount(3);
  await expect(page.getByText('NFT adicionado ao carrinho', { exact: true })).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath('receipt.png'), fullPage: true });
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
  await page.goto('/cart');
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await expect(page.getByTestId('cart-item')).toContainText('Neon Vessel #552');
});

test('validação de campos obrigatórios associa mensagem e impede criação', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile);
  await openCollector(page, isMobile);
  await page.getByLabel('Nome de exibição', { exact: true }).fill('');
  await page.getByLabel('E-mail', { exact: true }).fill('inválido');
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  const field = page.getByLabel('Nome de exibição', { exact: true });
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(field).toBeFocused();
  await expect(page.getByText('Informe o nome de exibição', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
});

test('carteira recusada mostra erro e permite tentar novamente', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile, 'wallet-rejected');
  await page.getByRole('button', { name: 'Conectar MetaMask', exact: true }).click();
  await expect(
    page.getByText('Conexão recusada. Tente conectar sua carteira novamente.', { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.setScenario('default');
  });
  await page.getByRole('button', { name: 'Conectar MetaMask', exact: true }).click();
  await expect(page.getByText('Carteira conectada', { exact: true })).toBeVisible();
});

test('carteira desconectada exige reconexão sem enviar pedido', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  let ordersSent = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/orders')) ordersSent++;
  });
  await page.evaluate(() => {
    window.__kurio.setScenario('wallet-disconnected');
  });
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByText('A carteira foi desconectada. Conecte novamente.', { exact: true }),
  ).toBeVisible();
  expect(ordersSent).toBe(0);
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
  await expect(page.getByRole('button', { name: 'Conectar MetaMask', exact: true })).toBeVisible();
});

test('cotação desatualizada bloqueia confirmação até nova revisão explícita', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile, 'price-changed-during-checkout');
  await reviewAndConnect(page);
  await expect(
    page.getByText('Os valores mudaram. Revise a nova cotação antes de confirmar.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar compra', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Revisar nova cotação', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Confirmar compra', exact: true })).toBeEnabled();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
});

test('edição esgotada durante checkout impede confirmação', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile, 'edition-sold-out-during-checkout');
  await reviewAndConnect(page);
  await expect(
    page.getByText('A edição ficou indisponível. Atualize seu carrinho.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar compra', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
});

test('sessão expirada restaura rascunho após novo login', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await openCollector(page, isMobile);
  await page.getByLabel('Nome de exibição', { exact: true }).fill('Rascunho da Ana');
  await page.evaluate(() => {
    window.__kurio.setScenario('session-expired');
  });
  await page.getByRole('button', { name: 'Conectar MetaMask', exact: true }).click();
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await openCollector(page, isMobile);
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue('Rascunho da Ana');
});

test('sem carteira cadastra e retorna ao pagamento pelo returnTo', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-grid')).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.reset('no-wallets');
  });
  await login(page, 'ana', '/');
  await addNft(page, isMobile);
  await page.getByRole('link', { name: 'Conectar e finalizar', exact: true }).click();
  await page.getByRole('link', { name: 'Cadastrar carteira', exact: true }).click();
  await expect(page).toHaveURL(/\/account\/wallets\?returnTo=/);
  await page.getByLabel('Apelido da carteira', { exact: true }).fill('Principal');
  await page
    .getByLabel('Endereço da carteira', { exact: true })
    .fill('0x1234567890abcdef1234567890abcdef12345678');
  await page.getByRole('button', { name: 'Salvar carteira', exact: true }).click();
  await expect(page.getByText('Carteira salva.', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao pagamento', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Revisar cotação', exact: true })).toBeVisible();
});

test('cotação expirada exige revisão mesmo sem mudança de preço', async ({ page, isMobile }) => {
  await page.clock.install();
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.clock.fastForward(61_000);
  await expect(
    page.getByRole('button', { name: 'Revisar nova cotação', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar compra', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
});
