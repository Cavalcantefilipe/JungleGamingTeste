import AxeBuilder from '@axe-core/playwright';

import { expect, test } from './fixtures/kurio';

test('carrinho, pagamento e conta não têm violações automáticas de acessibilidade', async ({
  page,
  kurio,
}) => {
  await kurio.loginAs('ana');
  await page.goto('/nfts/nft_001');
  await page.getByRole('radio', { name: /^1\/50/ }).click();
  await page
    .getByRole('button', { name: /^Comprar/ })
    .first()
    .click();
  await page.getByRole('list', { name: 'Itens do carrinho' }).waitFor();
  for (const [route, ready] of [
    ['/cart', 'Carrinho de NFTs'],
    ['/checkout', 'Finalizar compra'],
    ['/account/profile', 'Perfil do colecionador'],
    ['/account/wallets', 'Carteiras'],
  ] as const) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: ready, exact: true })).toBeVisible();
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations,
      `${route}: ${result.violations.map((issue) => `${issue.id}: ${issue.nodes.map((node) => node.target.join(',')).join(';')}`).join(' | ')}`,
    ).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
  }
});
