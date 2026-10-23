import AxeBuilder from '@axe-core/playwright';

import { nftListResponseSchema } from '@/contracts/nft';

import { addNft, prepareCheckout } from './fixtures/checkout';
import { expect, login, test } from './fixtures/kurio';

import type { Locator, Page } from '@playwright/test';

async function tabUntil(page: Page, target: Locator, reverse = false) {
  for (let step = 0; step < 160; step++) {
    if (await target.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press(reverse ? 'Shift+Tab' : 'Tab');
  }
  await expect(target).toBeFocused();
}
async function expectContainedFocus(page: Page, dialog: Locator) {
  for (let step = 0; step < 20; step++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
}
async function expectAccessible(page: Page, path: string) {
  await page.evaluate(() => document.fonts.ready);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    result.violations.filter((entry) => ['critical', 'serious'].includes(entry.impact ?? '')),
    `${path}: ${JSON.stringify(result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target }) => target) })))}`,
  ).toEqual([]);
}
async function expectNoOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
}

test('teclado alcança paginação e abre detalhe sem mouse', async ({ page }) => {
  await page.goto('/');
  const second = page.getByRole('button', { name: 'Página 2', exact: true });
  await expect(second).toBeVisible();
  await tabUntil(page, second);
  const pageTwoResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === '/api/nfts' && url.searchParams.get('page') === '2';
  });
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/page=2/);
  const first = nftListResponseSchema.parse(await (await pageTwoResponse).json()).items[0];
  if (!first) throw new Error('Segunda página sem NFTs');
  const nft = page.getByTestId('nft-grid').getByRole('link').first();
  await expect(nft).toHaveAttribute('href', `/nfts/${first.id}`);
  await tabUntil(page, nft, true);
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('gallery-image')).toBeVisible();
  await expect(page).toHaveURL(/\/nfts\//);
});

test('diálogo de login prende foco e devolve ao controle após Esc', async ({ page, isMobile }) => {
  await page.goto('/');
  const trigger = isMobile
    ? page.getByRole('link', { name: 'Perfil', exact: true })
    : page.getByRole('banner').getByRole('link', { name: 'Entrar', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expectContainedFocus(page, dialog);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('drawer mobile prende foco e devolve ao gatilho após Esc', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Drawer do frame mobile');
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Filtros', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expectContainedFocus(page, dialog);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('formulário anuncia erro e foca primeiro campo inválido', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  const email = page.getByLabel('E-mail', { exact: true });
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(
    page.getByRole('alert').filter({ hasText: 'Informe um e-mail válido' }),
  ).toBeVisible();
});

test('rotas públicas não têm violações críticas ou sérias de acessibilidade', async ({ page }) => {
  for (const path of ['/', '/nfts/nft-001', '/cart', '/login', '/register', '/inexistente']) {
    await page.goto(path);
    if (path === '/') await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
    if (path.startsWith('/nfts/')) await expect(page.getByTestId('gallery-image')).toBeVisible();
    if (path === '/cart')
      await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible();
    if (['/login', '/register'].includes(path))
      await expect(page.getByRole('dialog')).toBeVisible();
    await expectAccessible(page, path);
    await expectNoOverflow(page);
  }
});

test('carrinho cheio pagamento perfil carteiras e favoritos passam axe e não transbordam', async ({
  page,
  isMobile,
}) => {
  await prepareCheckout(page, isMobile);
  await expectAccessible(page, '/checkout');
  await expectNoOverflow(page);
  for (const path of ['/cart', '/account/profile', '/account/wallets', '/?favorites=true']) {
    await page.goto(path);
    if (path === '/cart') await expect(page.getByTestId('quote-total')).toBeVisible();
    if (path === '/account/profile')
      await expect(page.getByLabel('Nome de exibição', { exact: true })).toBeVisible();
    if (path === '/account/wallets')
      await expect(
        page.getByRole('button', { name: 'Salvar carteira', exact: true }).first(),
      ).toBeVisible();
    if (path.includes('favorites'))
      await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(3);
    await expectAccessible(page, path);
    await expectNoOverflow(page);
  }
});

test('largura equivalente ao zoom 200% mantém todas as telas utilizáveis', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Zoom desktop representado por 720 CSS pixels');
  await page.setViewportSize({ width: 720, height: 900 });
  await login(page);
  for (const path of [
    '/',
    '/nfts/nft-001',
    '/cart',
    '/account/profile',
    '/account/wallets',
    '/login',
    '/register',
  ]) {
    await page.goto(path);
    await expect(page.getByRole('main')).toBeAttached();
    await expectNoOverflow(page);
  }
  await addNft(page, true);
  await page.getByRole('link', { name: 'Conectar e finalizar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Revisar cotação', exact: true })).toBeVisible();
  await expectNoOverflow(page);
});

test('Mercado fica ativo no menu desktop do detalhe carrinho e pagamento', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Menu do frame desktop');
  await prepareCheckout(page, false);
  for (const path of ['/checkout', '/cart', '/nfts/nft-001']) {
    await page.goto(path);
    const market = page
      .getByRole('navigation', { name: 'Menu principal' })
      .getByRole('link', { name: 'Mercado', exact: true });
    await expect(market).toHaveAttribute('aria-current', 'page');
    await expect(market).toHaveCSS('color', 'rgb(232, 155, 85)');
  }
});

test('pedido pendente e recibo confirmado permanecem acessíveis', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await page.getByRole('button', { name: 'Revisar cotação', exact: true }).click();
  await expect(page.getByText('Cotação revisada', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Conectar MetaMask', exact: true }).click();
  await expect(page.getByText('Carteira conectada', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Aguardando confirmação da rede' })).toBeVisible();
  await expectAccessible(page, 'pedido pendente');
  await expectNoOverflow(page);
  await page.evaluate(() => {
    const order = window.__kurio.getState().orders[0];
    if (!order) throw new Error('Pedido ausente');
    window.__kurio.advanceOrder(order.id, 'confirmed');
  });
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectAccessible(page, 'recibo confirmado');
  await expectNoOverflow(page);
});
