import { prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function expectFullWidthDialog(page: Page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const geometry = await dialog.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { left: bounds.left, right: bounds.right, width: document.documentElement.clientWidth };
  });
  expect(Math.abs(geometry.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.right - geometry.width)).toBeLessThanOrEqual(1);
  await expect(dialog.getByRole('button', { name: 'Fechar', exact: true })).toBeVisible();
}

for (const width of [640, 720, 767]) {
  test(`login e cadastro ocupam o viewport inteiro em ${width}px`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Faixa intermediária e reflow do desktop ampliado');
    await page.setViewportSize({ width, height: 450 });
    for (const path of ['/login', '/register']) {
      await page.goto(path);
      await expectFullWidthDialog(page);
      const submit = page.getByRole('dialog').getByRole('button', {
        name: path === '/login' ? 'Entrar' : 'Criar perfil',
        exact: true,
      });
      await submit.scrollIntoViewIfNeeded();
      await expect(submit).toBeInViewport();
      await submit.click();
      await expect(page.getByRole('alert').first()).toBeVisible();
    }
  });
}

test('recibo ocupa o viewport de 720px e permite alcançar a ação final', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Reflow do desktop ampliado');
  await page.setViewportSize({ width: 720, height: 450 });
  await prepareCheckout(page, true);
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expectFullWidthDialog(page);
  const explorer = page.getByRole('link', { name: 'Ver no Etherscan (simulado)', exact: true });
  await explorer.scrollIntoViewIfNeeded();
  await expect(explorer).toBeInViewport();
});
