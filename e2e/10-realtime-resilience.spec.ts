import { prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { test, expect } from './fixtures/kurio';

for (const scenario of ['duplicate-events', 'stale-events']) {
  test(`${scenario} não regride pedido confirmado`, async ({ page, isMobile }) => {
    await prepareCheckout(page, isMobile, scenario);
    await reviewAndConnect(page);
    await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
    ).toBeVisible();
    await page.evaluate(() => {
      const order = window.__kurio.getState().orders[0];
      if (!order) throw new Error('Pedido ausente');
      window.__kurio.emit({
        id: crypto.randomUUID(),
        type: 'order.updated',
        resource: { kind: 'order', id: order.id },
        version: order.version + 1,
        occurredAt: new Date().toISOString(),
        payload: {
          status: 'pending',
          transactionRef: 'pending',
          explorerUrl: 'pending',
          updatedAt: new Date().toISOString(),
        },
      });
    });
    await expect(
      page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => window.__kurio.getState().orders[0]?.status)).toBe(
      'confirmed',
    );
  });
}

test('desconexão e reload recuperam pedido pendente sem novo POST', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  let sent = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/orders')) sent++;
  });
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(page).toHaveURL(/\/orders\//);
  const order = await page.evaluate(() => window.__kurio.getState().orders[0]);
  if (!order) throw new Error('Pedido ausente');
  await page.evaluate(() => {
    window.__kurio.disconnectSocket();
  });
  await page.goto('/checkout');
  await expect(page).toHaveURL(new RegExp(`/orders/${order.id}$`));
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  expect(sent).toBe(1);
  expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(1);
});

test('reconexão reconcilia mudança persistida sem evento recebido', async ({ page }) => {
  await page.goto('/nfts/nft-001');
  await expect(page.getByTestId('nft-price')).toHaveText('1.19 ETH');
  await page.evaluate(() => {
    window.__kurio.disconnectSocket();
  });
  await expect.poll(() => page.evaluate(() => window.__kurio.getConnections())).toEqual([]);
  await page.evaluate(() => {
    const nft = window.__kurio.getState().nfts[0];
    if (!nft) throw new Error('NFT ausente');
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: nft.id },
      version: nft.version + 1,
      occurredAt: new Date().toISOString(),
      payload: { price: '2.10', editions: nft.editions, badges: nft.badges },
    });
  });
  await expect(page.getByTestId('nft-price')).toHaveText('1.19 ETH');
  await page.evaluate(() => {
    window.__kurio.reconnectSocket();
  });
  await expect(page.getByTestId('nft-price')).toHaveText('2.10 ETH');
});

test('evento da sessão de Ana não revela pedido para Bruno', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Aguardando confirmação da rede', exact: true }),
  ).toBeVisible();
  const order = await page.evaluate(() => window.__kurio.getState().orders[0]);
  if (!order) throw new Error('Pedido ausente');
  await page.getByRole('link', { name: 'Voltar ao mercado', exact: true }).click();
  if (isMobile) await page.getByRole('link', { name: 'Perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir menu da conta', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('kurio.session'))).toBeNull();
  await page.getByRole('link', { name: 'Meu perfil', exact: true }).click();
  await page.getByLabel('E-mail', { exact: true }).fill('bruno@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/account\/profile/);
  await expect
    .poll(() => page.evaluate(() => window.__kurio.getConnections()))
    .toEqual(['user-bruno']);
  await page.evaluate((id) => {
    window.__kurio.advanceOrder(id, 'confirmed');
    const updated = window.__kurio.getState().orders.find((entry) => entry.id === id);
    if (!updated) throw new Error('Pedido ausente');
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'order.updated',
      resource: { kind: 'order', id },
      version: updated.version,
      occurredAt: new Date().toISOString(),
      payload: {
        status: updated.status,
        transactionRef: updated.transactionRef,
        explorerUrl: updated.explorerUrl,
        updatedAt: updated.updatedAt,
      },
    });
  }, order.id);
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue('Bruno Santos');
  await expect(page.getByTestId('order-items')).toHaveCount(0);
  await page.goto(`/orders/${order.id}`);
  await expect(
    page.getByText('Você não tem permissão para acessar este recurso.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('order-items')).toHaveCount(0);
});
