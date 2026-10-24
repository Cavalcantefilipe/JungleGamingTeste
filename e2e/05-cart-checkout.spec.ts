import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function addFirstNft(page: Page) {
  await page.goto('/nfts/nft_001');
  await page.getByRole('radio', { name: /^1\/50/ }).click();
  await page
    .getByRole('button', { name: /^Comprar/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(
    page.getByRole('list', { name: 'Itens do carrinho' }).getByText('Emerald Ape #042'),
  ).toBeVisible();
}

test('quantidade usa botões coloridos e menos com uma unidade remove como a lixeira', async ({
  page,
}) => {
  await addFirstNft(page);
  const increase = page.getByRole('button', { name: 'Aumentar quantidade de Emerald Ape #042' });
  const decrease = page.getByRole('button', { name: 'Diminuir quantidade de Emerald Ape #042' });
  await expect(increase).toHaveCSS('background-color', 'rgb(210, 138, 76)');
  await expect(decrease).toHaveCSS('background-color', 'rgb(210, 138, 76)');
  await increase.click();
  await expect(page.getByLabel('2 unidades', { exact: true })).toBeVisible();
  await expect(page.getByText('Emerald Ape #042')).toBeVisible();
  await decrease.click();
  await expect(page.getByLabel('1 unidades', { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('list', { name: 'Itens do carrinho' }).getByText('Emerald Ape #042'),
  ).toBeVisible();
  await decrease.click();
  await expect(page.getByRole('list', { name: 'Itens do carrinho' })).toBeHidden();
  await addFirstNft(page);
  await page.getByRole('button', { name: 'Remover Emerald Ape #042 do carrinho' }).click();
  await expect(page.getByRole('list', { name: 'Itens do carrinho' })).toBeHidden();
});

test('cupom e carrossel respondem às ações', async ({ page }) => {
  await addFirstNft(page);
  await expect(page.getByText('Desconto do lançamento')).toBeVisible();
  await expect(page.getByText(/\(-\) 0\.00 ETH/)).toBeVisible();
  await page.getByLabel('Código promocional').fill('LANCAMENTO10');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.getByRole('button', { name: /Remover cupom LANCAMENTO10/ })).toBeVisible();
  const track = page.getByRole('list', { name: 'NFTs recomendados' });
  await expect(track).toBeVisible();
  await page.getByRole('button', { name: 'Próximas recomendações' }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  if ((page.viewportSize()?.width ?? 0) >= 768) {
    const firstCard = track.getByTestId('nft-card').first();
    await firstCard.hover();
    await expect(firstCard).toHaveCSS('scale', '1.04');
  }
});

test('compra confirmada aparece apenas após resposta do pedido', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await addFirstNft(page);
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page).toHaveURL(/\/orders\/ord_/);
  await expect(page.getByRole('status')).toContainText(/Aguardando confirmação|Compra confirmada/);
  await expect(page.getByRole('status')).toHaveText('Compra confirmada', { timeout: 10_000 });
  await expect(page.getByRole('dialog')).toContainText('Detalhes da transação');
  await expect(page.getByRole('link', { name: 'Ver no Etherscan' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('Compra confirmada');
});

test('carrinho de visitante é preservado após login', async ({ page }) => {
  await addFirstNft(page);
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole('heading', { name: 'Resumo do pedido' })).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) < 768)
    await page.getByRole('button', { name: 'Resumo do pedido', exact: true }).click();
  await expect(page.getByText('Emerald Ape #042')).toBeVisible();
});

test('timeout recupera o mesmo pedido após recarregar a página', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await addFirstNft(page);
  await kurio.setScenario('order-timeout');
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page.getByRole('button', { name: 'Verificar pedido enviado' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('demorou demais', { timeout: 10_000 });
  await page.reload();
  await page.getByRole('button', { name: 'Verificar pedido enviado' }).click();
  await expect(page).toHaveURL(/\/orders\/ord_/);
  const orders = (await kurio.getState()).orders;
  expect(orders).toHaveLength(1);
});

test('pagamento recusado não aparece como compra confirmada', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await addFirstNft(page);
  await kurio.setScenario('payment-declined');
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page).toHaveURL(/\/orders\/ord_/);
  await expect(page.getByRole('status')).toHaveText('Compra não concluída', { timeout: 10_000 });
  await expect(page.getByRole('link', { name: 'Voltar ao carrinho' })).toBeVisible();
});

test('carteira recusada mantém o usuário no checkout sem criar pedido', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await addFirstNft(page);
  await kurio.setScenario('wallet-rejected');
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click();
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page.getByRole('alert')).toContainText('recusou');
  await expect(page).toHaveURL(/\/checkout/);
  expect((await kurio.getState()).orders).toHaveLength(0);
});

test('perfil e carteira podem ser editados', async ({ page, kurio }) => {
  await kurio.loginAs('ana');
  await page.goto('/account/profile');
  await page.getByLabel('Nome de exibição').fill('Ana Colecionadora');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByText('Perfil atualizado.')).toBeVisible();
  await expect(page.getByRole('banner')).toContainText('Ana Colecionadora');
  await page.reload();
  await expect(page.getByLabel('Nome de exibição')).toHaveValue('Ana Colecionadora');
  const tinyPng =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/ngAAAABJRU5ErkJggg==';
  await page.getByLabel('Enviar imagem do perfil').setInputFiles({
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: Buffer.from(tinyPng, 'base64'),
  });
  await expect(page.getByRole('img', { name: 'Imagem atual do perfil' })).toBeVisible();
  await page.getByRole('button', { name: 'Remover', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Imagem atual do perfil' })).toHaveCount(0);
  await page.goto('/account/wallets');
  await expect(page.getByRole('heading', { name: 'Carteira principal' })).toBeVisible();
  const primary = page.getByRole('heading', { name: 'Carteira principal' }).locator('..');
  await primary.getByLabel('Apelido da carteira').fill('Minha carteira');
  await primary.getByRole('button', { name: 'Salvar carteira' }).click();
  await expect(page.getByText('Carteira salva.')).toBeVisible();
  await page.reload();
  await expect(
    page
      .getByRole('heading', { name: 'Carteira principal' })
      .locator('..')
      .getByLabel('Apelido da carteira'),
  ).toHaveValue('Minha carteira');
});

test('login e cadastro cabem em uma tela baixa sem rolagem interna do diálogo', async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 600 });
  await page.goto('/login');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  await page.goto('/register');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Criar perfil' })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/register');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(
    true,
  );
});
