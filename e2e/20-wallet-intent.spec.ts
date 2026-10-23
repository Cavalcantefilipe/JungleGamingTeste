import { openCollector, prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';

for (const phase of ['wallet-session/connect', 'orders']) {
  test(`editar carteira durante ${phase} exige nova revisão e preserva carrinho`, async ({
    page,
    isMobile,
  }) => {
    await prepareCheckout(page, isMobile);
    await reviewAndConnect(page);
    await openCollector(page, isMobile);
    await page
      .getByLabel('Observação do colecionador (opcional)', { exact: true })
      .fill('Manter meu rascunho');
    await page.evaluate(() => {
      window.__kurio.setNetwork({ latencyMs: 1800 });
      const original = window.setTimeout.bind(window);
      let delays = 0;
      Object.defineProperty(window, 'setTimeout', {
        value: (handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
          if (timeout === 1800)
            document.documentElement.dataset.walletIntentDelays = String(++delays);
          return original(handler, timeout, ...args);
        },
      });
    });
    const response = page.waitForResponse(
      (entry) => entry.request().method() === 'POST' && entry.url().endsWith(`/api/${phase}`),
    );
    await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-wallet-intent-delays',
      phase === 'orders' ? '2' : '1',
    );
    const status = await page.evaluate(async () => {
      window.__kurio.setNetwork({ latencyMs: 0 });
      const state = window.__kurio.getState();
      const session = state.sessions.find((entry) => entry.userId === 'user-ana');
      const wallet = state.wallets['user-ana']?.primary;
      if (!session || !wallet) throw new Error('Sessão ou carteira ausente');
      const result = await fetch('/api/wallets/primary', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...wallet, address: '0x9876543210abcdef1234567890abcdef12345678' }),
      });
      return result.status;
    });
    expect(status).toBe(200);
    expect((await response).status()).toBe(409);
    await expect(page.getByRole('alert').filter({ hasText: 'A carteira mudou' })).toHaveCount(1);
    expect(await page.evaluate(() => window.__kurio.getState().orders.length)).toBe(0);
    expect(
      await page.evaluate(() => window.__kurio.getState().carts['user:user-ana']?.items.length),
    ).toBe(1);
    await expect(page.getByLabel('Endereço da carteira', { exact: true })).toHaveValue(
      '0x9876543210abcdef1234567890abcdef12345678',
    );
    await expect(
      page.getByLabel('Observação do colecionador (opcional)', { exact: true }),
    ).toHaveValue('Manter meu rascunho');
    await expect(
      page.getByRole('button', { name: 'Confirmar compra', exact: true }),
    ).toBeDisabled();
    await page.getByRole('button', { name: 'Revisar nova cotação', exact: true }).click();
    await page.getByRole('button', { name: 'Conectar MetaMask', exact: true }).click();
    await expect(page.getByText('Carteira conectada', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
    await expect(page).toHaveURL(/\/orders\//);
    expect(await page.evaluate(() => window.__kurio.getState().orders[0]?.wallet.address)).toBe(
      '0x9876543210abcdef1234567890abcdef12345678',
    );
  });
}
