import { loginFromForm, openCheckout } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';

test('rascunho persiste após refresh e expiração durante pagamento', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await openCheckout(page);
  await page.getByLabel('Nome de exibição', { exact: true }).fill('Ana Colecionadora');
  await page.getByLabel('Observações', { exact: false }).fill('Preservar esta observação');
  await page.reload();
  if ((page.viewportSize()?.width ?? 0) < 768)
    await page.getByRole('button', { name: 'Perfil do colecionador' }).click();
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue(
    'Ana Colecionadora',
  );
  await kurio.setScenario('session-expired');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await loginFromForm(page);
  await expect(page).toHaveURL(/\/checkout/);
  if ((page.viewportSize()?.width ?? 0) < 768)
    await page.getByRole('button', { name: 'Perfil do colecionador' }).click();
  await expect(page.getByLabel('Observações', { exact: false })).toHaveValue(
    'Preservar esta observação',
  );
  expect((await kurio.getState()).orders).toHaveLength(0);
});

test('nota longa apresenta erro associado e não cria pedido', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await openCheckout(page);
  const note = page.getByLabel('Observações', { exact: false });
  await note.fill('a'.repeat(501));
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(note).toHaveAttribute('aria-invalid', 'true');
  await expect(note).toHaveAccessibleDescription(/500/);
  expect((await kurio.getState()).orders).toHaveLength(0);
});

test('preço recebido pelo Socket.IO exige revisão e envio repetido cria só um pedido', async ({
  page,
  kurio,
}) => {
  await kurio.loginAs('ana');
  await openCheckout(page);
  await expect
    .poll(() => page.evaluate(() => window.__kurio?.realtimeConnections()))
    .toBeGreaterThan(0);
  await page.evaluate(() => {
    const control = window.__kurio;
    const nft = control?.updateNft('nft_001', { price: '2.39' });
    if (!control || !nft) throw new Error('Mock indisponível');
    control.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: nft.id },
      version: nft.version,
      occurredAt: new Date().toISOString(),
      payload: { price: nft.price },
    });
  });
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled();
  await expect(page.getByRole('complementary', { name: 'Resumo do pedido' })).toContainText(
    '2.39 ETH',
  );
  await page.getByRole('button', { name: 'Revisei os novos valores' }).click();
  await kurio.setNetwork({ latencyMs: 700, jitterMs: 0 });
  await page.getByRole('button', { name: 'Confirmar compra' }).dblclick();
  await expect(page).toHaveURL(/\/orders\/ord_/);
  await expect(page.getByRole('status')).toHaveText('Compra confirmada', { timeout: 10_000 });
  expect((await kurio.getState()).orders).toHaveLength(1);
});

test('mudança de rede recalcula taxas e provedor escolhido aparece no resumo', async ({
  page,
  kurio,
}) => {
  await kurio.loginAs('ana');
  await openCheckout(page);
  await page.getByLabel('Rede', { exact: true }).selectOption('polygon');
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled();
  await expect(page.getByRole('complementary', { name: 'Resumo do pedido' })).toContainText(
    '0.002 ETH',
  );
  await page.getByRole('radio', { name: 'Coinbase Wallet', exact: true }).check();
  await expect(page.getByRole('complementary', { name: 'Resumo do pedido' })).toContainText(
    'Coinbase Wallet · Polygon',
  );
  await page.getByRole('button', { name: 'Revisei os novos valores' }).click();
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeEnabled();
});

test('timeout seguido de expiração recupera o mesmo pedido', async ({ page, kurio }) => {
  test.setTimeout(45_000);
  await kurio.loginAs('ana');
  await openCheckout(page);
  await kurio.setScenario('order-timeout');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page.getByRole('alert')).toContainText('demorou demais', { timeout: 10_000 });
  await kurio.setScenario('session-expired');
  await page.getByRole('button', { name: 'Verificar pedido enviado' }).click();
  await expect(page).toHaveURL(/\/login/);
  await loginFromForm(page);
  await expect(page).toHaveURL(/\/checkout/);
  await page.getByRole('button', { name: 'Verificar pedido enviado' }).click();
  await expect(page).toHaveURL(/\/orders\/ord_/);
  await expect(page.getByRole('status')).toHaveText('Compra confirmada', { timeout: 10_000 });
  expect((await kurio.getState()).orders).toHaveLength(1);
});

test('estoque esgotado durante checkout bloqueia o envio e preserva o carrinho', async ({
  page,
  kurio,
}) => {
  await kurio.loginAs('ana');
  await openCheckout(page);
  await expect
    .poll(() => page.evaluate(() => window.__kurio?.realtimeConnections()))
    .toBeGreaterThan(0);
  await page.evaluate(() => {
    const control = window.__kurio;
    const original = control?.getState().nfts.find((nft) => nft.id === 'nft_001');
    if (!control || !original) throw new Error('Mock indisponível');
    const nft = control.updateNft(original.id, {
      editions: original.editions.map((edition) => ({ ...edition, available: 0 })),
    });
    if (!nft) throw new Error('NFT indisponível');
    control.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: nft.id },
      version: nft.version,
      occurredAt: new Date().toISOString(),
      payload: { editions: nft.editions },
    });
  });
  await expect(page.getByRole('alert')).toContainText('Quantidade indisponível');
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled();
  expect((await kurio.getState()).orders).toHaveLength(0);
  expect((await kurio.getState()).carts.some((cart) => cart.items.length > 0)).toBe(true);
});

test('pedido pendente sobrevive à reconexão e ignora tentativa de reabrir confirmado', async ({
  page,
  kurio,
}) => {
  await kurio.loginAs('ana');
  await openCheckout(page);
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page).toHaveURL(/\/orders\/ord_/);
  await page.evaluate(() => {
    window.__kurio?.disconnectRealtime();
  });
  await expect(page.getByRole('status')).toHaveText('Compra confirmada', { timeout: 10000 });
  await expect
    .poll(() => page.evaluate(() => window.__kurio?.realtimeConnections()))
    .toBeGreaterThan(0);
  await page.evaluate(() => {
    const control = window.__kurio;
    const order = control?.getState().orders[0];
    if (!control || !order) throw new Error('Pedido indisponível');
    control.emit({
      id: crypto.randomUUID(),
      type: 'order.updated',
      resource: { kind: 'order', id: order.id },
      version: order.version + 1,
      occurredAt: new Date().toISOString(),
      payload: { status: 'pending' },
    });
  });
  await expect(page.getByRole('status')).toHaveText('Compra confirmada');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('Compra confirmada');
  expect((await kurio.getState()).orders).toHaveLength(1);
});

test('recuperação continua disponível quando a reserva esgota a edição', async ({
  page,
  kurio,
}) => {
  await page.clock.setFixedTime(new Date('2026-10-23T12:00:00.000Z'));
  await kurio.loginAs('ana');
  await page.goto('/nfts/nft_001');
  await page.getByRole('radio', { name: /^1\/1\s/ }).click();
  await page
    .getByRole('button', { name: /^Comprar/ })
    .first()
    .click();
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await kurio.setScenario('order-timeout');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect.poll(async () => (await kurio.getState()).orders.length).toBe(1);
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Quantidade indisponível');
  await page.getByRole('button', { name: 'Verificar pedido enviado' }).click();
  await expect(page).toHaveURL(/\/orders\/ord_/);
  expect((await kurio.getState()).orders).toHaveLength(1);
});

test('remover favorito atualiza a lista filtrada', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await page.goto('/?favorites=true');
  const cards = page.getByRole('list', { name: 'Resultados' }).getByTestId('nft-card');
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  await cards.first().getByRole('button', { name: 'Remover dos favoritos' }).click();
  await expect(cards).toHaveCount(count - 1);
});

test('senha atual incorreta tem erro associado e a alteração válida persiste', async ({
  page,
  kurio,
}) => {
  await kurio.loginAs('ana');
  await page.goto('/account/profile');
  const current = page.getByLabel('Senha atual', { exact: true });
  await current.fill('SenhaIncorreta!1');
  await page.getByLabel('Nova senha', { exact: true }).fill('NovaKurio!2026');
  await page.getByLabel('Confirmar nova senha').fill('NovaKurio!2026');
  await page.getByRole('button', { name: 'Alterar senha', exact: true }).click();
  await expect(current).toHaveAccessibleDescription(/incorreta/i);
  await current.fill('Kurio!2026');
  await page.getByRole('button', { name: 'Alterar senha', exact: true }).click();
  await expect(page.getByText('Senha alterada.')).toBeVisible();
  await page.reload();
  await current.fill('NovaKurio!2026');
  await page.getByLabel('Nova senha', { exact: true }).fill('Kurio!2026');
  await page.getByLabel('Confirmar nova senha').fill('Kurio!2026');
  await page.getByRole('button', { name: 'Alterar senha', exact: true }).click();
  await expect(page.getByText('Senha alterada.')).toBeVisible();
});
