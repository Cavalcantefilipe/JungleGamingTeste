import { test, expect } from './fixtures/kurio';

test('header, navegação, main e footer têm landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.getByRole('navigation').filter({ visible: true }).first()).toBeVisible();
});
test('ações editoriais e newsletter informam indisponibilidade', async ({ page, isMobile }) => {
  await page.goto('/');
  if (!isMobile) {
    await page.getByRole('button', { name: 'Criadores', exact: true }).click();
    await expect(
      page.getByText('Conteúdo indisponível nesta demonstração', { exact: true }),
    ).toBeVisible();
    await expect(page).toHaveURL('http://127.0.0.1:4175/');
  }
  await page
    .getByRole('textbox', { name: 'E-mail para newsletter' })
    .fill('colecionador@example.test');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(
    page.getByText('Newsletter indisponível nesta demonstração', { exact: true }),
  ).toBeVisible();
});
test('rota inexistente mostra 404 e volta para início', async ({ page }) => {
  await page.goto('/pagina-inexistente');
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar para Início', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4175/');
});
test('tab bar aparece somente no mobile', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await expect(page.getByRole('navigation', { name: 'Navegação mobile' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Menu principal' })).toBeHidden();
  } else {
    await expect(page.getByRole('navigation', { name: 'Menu principal' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navegação mobile' })).toBeHidden();
  }
});

test('catálogo não transborda em 390, 768 e 1440 pixels', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium');
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `.superpowers/catalog-${width}.png`, fullPage: true });
  }
});
