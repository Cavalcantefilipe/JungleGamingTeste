import { expect, test } from './fixtures/kurio';

test('gradientes originais aparecem nas superfícies mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Gradientes específicos do Figma mobile');
  await page.goto('/');
  const cards = page.getByTestId('nft-grid').locator('article');
  await expect(cards).toHaveCount(9);
  await expect(page.getByRole('button', { name: 'Filtros', exact: true })).toHaveCSS(
    'background-image',
    /linear-gradient/,
  );
  await expect(cards.first().getByTestId('nft-card-media')).toHaveCSS(
    'background-image',
    /linear-gradient/,
  );
  await page.goto('/nfts/nft-001');
  await expect(page.getByTestId('detail-background')).toHaveCSS(
    'background-image',
    /linear-gradient/,
  );
});

test('favorito acompanha a imagem e funciona sem hover no toque', async ({ page, isMobile }) => {
  await page.goto('/');
  const card = page.getByTestId('nft-grid').locator('article').first();
  const favorite = card.getByRole('button', { name: /Favoritar/ });
  await expect(favorite).toBeEnabled();
  await page.mouse.move(0, 0);
  if (!isMobile) {
    await expect(favorite).toHaveCSS('opacity', '0');
    await card.hover();
  }
  await expect(favorite).toHaveCSS('opacity', '1');
  const image = await card.locator('img').boundingBox();
  const button = await favorite.boundingBox();
  expect(image).not.toBeNull();
  expect(button).not.toBeNull();
  if (!image || !button) return;
  expect(button.width).toBeGreaterThanOrEqual(isMobile ? 44 : 40);
  expect(button.y + button.height / 2 - image.y).toBeCloseTo(14, 0);
  if (!isMobile) {
    await page.mouse.move(0, 0);
    await favorite.focus();
    await expect(favorite).toHaveCSS('opacity', '1');
  }
  await favorite.click();
  await expect(page).toHaveURL(/\/login/);
});
