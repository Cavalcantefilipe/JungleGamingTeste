import { prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { test, expect } from './fixtures/kurio';

async function firstOrder(page: Parameters<typeof prepareCheckout>[0]) {
  const order = await page.evaluate(() => window.__kurio.getState().orders[0]);
  if (!order) throw new Error('Pedido não criado');
  return order;
}

test('pagamento recusado mantém carrinho e permite uma nova tentativa', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile, 'payment-declined');
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Pagamento recusado', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => window.__kurio.getState().carts['user:user-ana']?.items.length),
  ).toBe(1);
  await page.evaluate(() => {
    window.__kurio.setScenario('default');
  });
  await page.getByRole('link', { name: 'Tentar novamente', exact: true }).click();
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(2);
});

test('três cliques rápidos não criam pedidos ou chaves duplicadas', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  const keys: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/orders'))
      keys.push(request.headers()['idempotency-key'] ?? '');
  });
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).evaluate((button) => {
    if (!(button instanceof HTMLButtonElement)) throw new Error('Botão ausente');
    button.click();
    button.click();
    button.click();
  });
  await expect(page).toHaveURL(/\/orders\//);
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
  expect(new Set(keys).size).toBe(1);
  expect(keys.every(Boolean)).toBe(true);
});

test('timeout e reload recuperam o mesmo pedido pela chave original', async ({
  page,
  isMobile,
}) => {
  await page.clock.install();
  await prepareCheckout(page, isMobile, 'order-timeout');
  await reviewAndConnect(page);
  const keys: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/orders'))
      keys.push(request.headers()['idempotency-key'] ?? '');
  });
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
  const order = await firstOrder(page);
  await page.clock.fastForward(6500);
  await expect(page.getByRole('button', { name: 'Recuperar pedido', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Recuperar pedido', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Recuperar pedido', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/orders/${order.id}$`));
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
  expect(keys.length).toBeGreaterThanOrEqual(2);
  expect(new Set(keys).size).toBe(1);
});

test('recibo só aparece depois da confirmação autoritativa', async ({ page, isMobile }) => {
  await page.clock.install();
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Aguardando confirmação da rede', exact: true }),
  ).toBeVisible();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toHaveCount(0);
  const order = await firstOrder(page);
  expect(order.status).toBe('pending');
  await page.evaluate((id) => {
    window.__kurio.advanceOrder(id, 'confirmed');
  }, order.id);
  await page.clock.runFor(100);
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
});

test('recibo preserva o snapshot quando o preço do catálogo muda', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  const total = await page.getByTestId('order-total').textContent();
  await page.evaluate(() => {
    const nft = window.__kurio.getState().nfts[0];
    if (!nft) throw new Error('NFT ausente');
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: nft.id },
      version: nft.version + 1,
      occurredAt: new Date().toISOString(),
      payload: { price: '9.99', editions: nft.editions, badges: nft.badges },
    });
  });
  await expect(page.getByTestId('order-total')).toHaveText(total ?? '');
  await expect(page.getByTestId('order-items')).toContainText('1.19 ETH');
  expect((await firstOrder(page)).items[0]?.unitPrice).toBe('1.19');
});

test('mudança de preço durante envio rejeita sem compra e libera nova revisão', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 700 });
  });
  let changed = false;
  page.on('request', (request) => {
    if (changed || !request.url().endsWith('/api/wallet-session/connect')) return;
    changed = true;
    void page.evaluate(() => {
      const nft = window.__kurio.getState().nfts[0];
      if (!nft) throw new Error('NFT ausente');
      window.__kurio.emit({
        id: crypto.randomUUID(),
        type: 'nft.updated',
        resource: { kind: 'nft', id: nft.id },
        version: nft.version + 1,
        occurredAt: new Date().toISOString(),
        payload: { price: '2.19', editions: nft.editions, badges: nft.badges },
      });
    });
  });
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Os valores mudaram' })).toHaveCount(1);
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 0 });
  });
  await page.getByRole('button', { name: 'Revisar nova cotação', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(page).toHaveURL(/\/orders\//);
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
});

test('tentativa salva corrompida bloqueia nova compra com erro compreensível', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile);
  await page.evaluate(() => {
    localStorage.setItem('kurio.pendingOrder.user-ana', '{');
  });
  await page.reload();
  await expect(
    page.getByRole('heading', {
      name: 'Não foi possível recuperar a tentativa salva.',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recarregar', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmar compra', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
});
