import { expect, login, test } from './fixtures/kurio';

test('nft-002 usa estrelas vetoriais e as cores de avaliação do Figma', async ({
  page,
  isMobile,
}) => {
  await page.goto('/nfts/nft-002');
  const rating = page.getByRole('img', { name: /Avaliação: .* de 5/ }).filter({ visible: true });
  await expect(rating).toBeVisible();
  const icons = rating.locator('svg');
  await expect(icons).toHaveCount(isMobile ? 1 : 5);
  await expect(icons.first()).toHaveCSS(
    'color',
    isMobile ? 'rgb(227, 164, 78)' : 'rgb(210, 138, 76)',
  );
  await expect(icons.first()).toHaveCSS('width', isMobile ? '12px' : '15px');
  if (!isMobile) await expect(icons.last()).toHaveCSS('color', 'rgb(207, 178, 140)');
});

test('favorito do detalhe tem contorno próprio e mantém o estado após recarregar', async ({
  page,
  isMobile,
}) => {
  await login(page, 'ana', '/nfts/nft-002');
  const favorite = page
    .getByRole('button', { name: /Favoritar/ })
    .filter({ visible: true })
    .first();
  await expect(favorite).toBeEnabled();
  if (isMobile) {
    const circle = await favorite.evaluate((element) => {
      const style = getComputedStyle(element, '::before');
      return {
        width: style.width,
        height: style.height,
        fill: style.backgroundColor,
        border: style.borderTopColor,
      };
    });
    expect(circle).toEqual({
      width: '35px',
      height: '35px',
      fill: 'rgb(47, 29, 21)',
      border: 'rgb(63, 35, 25)',
    });
    expect((await favorite.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    await expect(favorite.locator('svg')).toHaveCSS('width', '16px');
  } else {
    await expect(favorite).toHaveCSS('border-top-color', 'rgb(210, 138, 76)');
    await expect(favorite).toHaveCSS('width', '130px');
    await expect(favorite.locator('svg')).toHaveCSS('width', '20px');
    await expect(favorite.locator('svg')).toHaveCSS('color', 'rgb(210, 138, 76)');
  }
  await favorite.click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await expect(favorite).toHaveAttribute('aria-busy', 'false');
  await page.reload();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await favorite.click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'false');
});

test('galeria permite ampliar a imagem selecionada e restaura o foco', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'A lupa pertence ao frame desktop');
  await page.goto('/nfts/nft-002');
  await page.getByRole('button', { name: 'Ver imagem 2', exact: true }).click();
  const original = await page.getByTestId('gallery-image').getAttribute('src');
  const zoom = page.getByRole('button', { name: 'Ampliar imagem', exact: true });
  await zoom.click();
  const dialog = page.getByRole('dialog', { name: 'Imagem ampliada', exact: true });
  await expect(dialog.getByRole('img')).toHaveAttribute('src', original ?? '');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(zoom).toBeFocused();
});

test('abas de detalhe têm sublinhado e não cortam o texto em telas estreitas', async ({
  page,
  isMobile,
}) => {
  if (isMobile) await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/nfts/nft-002');
  const details = page.getByRole('tab', { name: 'Detalhes do NFT', exact: true });
  await expect(details).toHaveCSS('color', 'rgb(232, 155, 85)');
  await expect(details).toHaveCSS('border-bottom-color', 'rgb(210, 138, 76)');
  const reviews = page.getByRole('tab', { name: /Avaliações/ });
  const reviewsBox = await reviews.boundingBox();
  const contentBox = await page.getByRole('tabpanel').boundingBox();
  expect(reviewsBox && contentBox && contentBox.y >= reviewsBox.y + reviewsBox.height).toBe(true);
  await reviews.click();
  await expect(page.getByRole('tabpanel')).toContainText('de 5');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('ações do detalhe cabem nos pontos de quebra entre tablet e desktop', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Cobertura das larguras intermediárias do desktop');
  for (const width of [768, 1024, 1080, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/nfts/nft-002');
    await expect(page.getByTestId('gallery-image')).toBeVisible();
    const favorite = page
      .getByRole('button', { name: 'Favoritar Sage Nomad #009', exact: true })
      .filter({ visible: true });
    await expect(favorite).toBeVisible();
    {
      const button = await favorite.boundingBox();
      expect(button && button.x + button.width <= width).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('cabeçalho usa contorno ativo e botão de entrada do Figma', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Cabeçalho do frame desktop');
  await page.goto('/nfts/nft-002');
  const market = page
    .getByRole('navigation', { name: 'Menu principal' })
    .getByRole('link', { name: 'Mercado', exact: true });
  await expect(market).toHaveCSS('text-decoration-thickness', '3px');
  await expect(market).toHaveCSS('font-weight', '700');
  const loginButton = page.getByRole('banner').getByRole('link', { name: 'Entrar', exact: true });
  await expect(loginButton).toHaveCSS('width', '100px');
  await expect(loginButton).toHaveCSS('height', '35px');
});

test('ícones do menu da conta correspondem à função desenhada no Figma', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Ícones da navegação desktop');
  await login(page);
  const menu = page.getByRole('navigation', { name: 'Menu da conta', exact: true });
  await expect(
    menu.getByRole('button', { name: 'Atividade', exact: true }).locator('use'),
  ).toHaveAttribute('href', '/images/ui/figma-icons.svg#cart');
  await expect(
    menu.getByRole('button', { name: 'Ofertas', exact: true }).locator('use'),
  ).toHaveAttribute('href', '/images/ui/figma-icons.svg#activity');
});
