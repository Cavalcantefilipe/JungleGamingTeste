import { writeFile } from 'node:fs/promises';

import { test, expect } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function addFirstNft(page: Page, isMobile: boolean) {
  await page.goto('/nfts/nft-001');
  await page
    .getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true })
    .click();
  await expect(page).toHaveURL(/\/cart/);
  return page.getByTestId('cart-item').filter({ hasText: 'Emerald Ape #042' });
}

test('adicionar, alterar e remover refletem no resumo da API', async ({ page, isMobile }) => {
  const row = await addFirstNft(page, isMobile);
  await expect(page.getByTestId('quote-total')).toHaveText('1.206 ETH');
  await row.getByRole('spinbutton', { name: 'Quantidade', exact: true }).fill('2');
  await expect(page.getByTestId('quote-subtotal')).toHaveText('2.38 ETH');
  await expect(page.getByTestId('quote-total')).toHaveText('2.396 ETH');
  await expect(row.getByRole('spinbutton')).toBeEnabled();
  await row.getByRole('button', { name: 'Remover Emerald Ape #042', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible();
});

test('conflito de estoque reverte quantidade e apresenta disponibilidade atual', async ({
  page,
  isMobile,
}) => {
  const row = await addFirstNft(page, isMobile);
  await expect(row.getByRole('spinbutton')).toHaveAttribute('max', '10');
  await page.evaluate(() => {
    window.__kurio.disconnectSocket();
  });
  await expect.poll(() => page.evaluate(() => window.__kurio.getConnections().length)).toBe(0);
  await page.evaluate(() => {
    const nft = window.__kurio.getState().nfts.find((item) => item.id === 'nft-001');
    if (!nft) throw new Error('Fixture ausente');
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: nft.id },
      occurredAt: new Date().toISOString(),
      version: 2,
      payload: {
        editions: nft.editions.map((edition) =>
          edition.id === 'nft-001-10' ? { ...edition, available: 3 } : edition,
        ),
      },
    });
  });
  await row.getByRole('spinbutton').fill('5');
  await expect(page.getByText(/Disponível: 3/)).toBeVisible();
  await expect(row.getByRole('spinbutton')).toHaveValue('1');
  await expect(row.getByRole('spinbutton')).toHaveAttribute('max', '3');
});

test('carrinho persiste após refresh', async ({ page, isMobile }) => {
  const row = await addFirstNft(page, isMobile);
  await expect(row.getByRole('spinbutton')).toBeEnabled();
  await row.getByRole('spinbutton').fill('2');
  await expect(page.getByTestId('quote-total')).toHaveText('2.396 ETH');
  await expect(row.getByRole('spinbutton')).toBeEnabled();
  await page.reload();
  await expect(row.getByRole('spinbutton')).toHaveValue('2');
});

test('itens de visitante são preservados ao autenticar', async ({ page, isMobile }) => {
  await addFirstNft(page, isMobile);
  await expect(page.getByTestId('quote-total')).toBeVisible();
  await page.getByRole('link', { name: 'Conectar e finalizar', exact: true }).click();
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await page.goto('/cart');
  await expect(page.getByTestId('cart-item').getByRole('spinbutton')).toHaveValue('1');
});

test('cupom aplica desconto da API e remoção restaura total', async ({ page, isMobile }) => {
  await addFirstNft(page, isMobile);
  await page.getByLabel('Código promocional', { exact: true }).fill('LANCAMENTO10');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect(page.getByTestId('quote-discount')).toHaveText('0.119 ETH');
  await expect(page.getByTestId('quote-total')).toHaveText('1.087 ETH');
  await page.getByRole('button', { name: 'Remover cupom', exact: true }).click();
  await expect(page.getByTestId('quote-total')).toHaveText('1.206 ETH');
});

test('cupom inválido e expirado mostram erro associado ao campo', async ({ page, isMobile }) => {
  await addFirstNft(page, isMobile);
  const input = page.getByLabel('Código promocional', { exact: true });
  for (const [code, message] of [
    ['INVALIDO', 'Cupom inválido.'],
    ['EXPIRADO10', 'Este cupom expirou.'],
  ]) {
    await input.fill(code ?? '');
    await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
    await expect(page.getByText(message ?? '', { exact: true })).toBeVisible();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', /coupon-error/);
    await page.getByRole('button', { name: 'Remover cupom', exact: true }).click();
  }
});

test('preço via socket destaca item e atualiza resumo; atualizar aceita preço novo', async ({
  page,
  isMobile,
}) => {
  const row = await addFirstNft(page, isMobile);
  await expect(page.getByTestId('quote-total')).toHaveText('1.206 ETH');
  await page.evaluate(() => {
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: 'nft-001' },
      occurredAt: new Date().toISOString(),
      version: 2,
      payload: { price: '2.5' },
    });
  });
  await expect(
    page.getByText('O preço ou a disponibilidade deste NFT mudou.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId('quote-total')).toHaveText('2.516 ETH');
  await page.getByRole('button', { name: 'Atualizar carrinho', exact: true }).click();
  await expect(
    page.getByText('O preço ou a disponibilidade deste NFT mudou.', { exact: true }),
  ).toHaveCount(0);
  await expect(row).toContainText('2.50 ETH');
});

test('resumo mostra skeleton em rede lenta', async ({ page, isMobile }) => {
  await addFirstNft(page, isMobile);
  await page.evaluate(() => {
    window.__kurio.setScenario('slow-network');
  });
  await page.goto('/cart');
  await expect(page.getByLabel('Carregando resumo', { exact: true })).toBeVisible();
  await expect(page.getByTestId('quote-total')).toHaveText('1.206 ETH');
});

test('quantidade atualiza estimativa antes da rede e consulta a cotação uma vez', async ({
  page,
  isMobile,
}, testInfo) => {
  const row = await addFirstNft(page, isMobile);
  await expect(page.getByTestId('quote-total')).toHaveText('1.206 ETH');
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 1500, jitterMs: 0 });
  });
  const quotes: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/quote') quotes.push(request.url());
  });
  const startedAt = Date.now();
  await row.getByRole('spinbutton').fill('2');
  await expect(page.getByTestId('quote-total')).toHaveText('2.396 ETH', { timeout: 500 });
  const feedbackMs = Date.now() - startedAt;
  await expect(page.getByText('Total estimado', { exact: true })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Atualizando cotação' })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Conectar e finalizar' })).toBeDisabled();
  await expect(page.getByRole('status', { name: 'Atualizando cotação' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Conectar e finalizar' })).toBeVisible();
  expect(quotes).toHaveLength(1);
  const measurementPath = testInfo.outputPath('latency.json');
  await writeFile(
    measurementPath,
    JSON.stringify({
      feedbackMs,
      confirmedMs: Date.now() - startedAt,
      quoteRequests: quotes.length,
      simulatedLatencyMs: 1500,
    }),
  );
  await testInfo.attach('latencia-carrinho.json', {
    path: measurementPath,
    contentType: 'application/json',
  });
});

test('login aguarda inclusão pendente do visitante antes do merge', async ({ page }) => {
  await page.goto('/nfts/nft-001');
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042', exact: true })).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 1200, jitterMs: 0 });
  });
  await page
    .getByRole('button', { name: 'Adicionar ao carrinho', exact: true })
    .filter({ visible: true })
    .click();
  await page
    .getByRole('button', { name: 'Favoritar Emerald Ape #042', exact: true })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 0, jitterMs: 0 });
  });
  await page.getByLabel('E-mail', { exact: true }).fill('bruno@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/nfts\/nft-001/);
  await page.goto('/cart');
  await expect(page.getByTestId('cart-item').getByRole('spinbutton')).toHaveValue('1');
});
