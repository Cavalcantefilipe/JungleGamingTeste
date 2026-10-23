import { expect, test } from './fixtures/kurio';

test('hero entrega imagem responsiva AVIF e preload de fonte local', async ({ page, isMobile }) => {
  await page.goto('/');
  const hero = page.getByTestId('home-hero');
  const image = hero.getByRole('img', { name: 'Ilustração de Emerald Ape #042', exact: true });
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate((element) => (element instanceof HTMLImageElement ? element.currentSrc : '')),
    )
    .toMatch(isMobile ? /emerald-400\.avif$/ : /emerald-800\.avif$/);
  await expect(page.locator('link[rel="preload"][as="font"]').first()).toHaveAttribute(
    'href',
    /400-normal.*\.woff2$/,
  );
  if (isMobile) {
    const backdrop = hero.locator('img[aria-hidden="true"]').first();
    await expect(backdrop).toHaveAttribute('fetchpriority', 'high');
  }
});

test('galeria usa AVIF do tamanho adequado e campo de quantidade alcança 24px', async ({
  page,
  isMobile,
}) => {
  await page.goto('/nfts/nft-001');
  const image = page.getByTestId('gallery-image');
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate((element) => (element instanceof HTMLImageElement ? element.currentSrc : '')),
    )
    .toMatch(isMobile ? /emerald-400\.avif$/ : /emerald-800\.avif$/);
  const quantity = page
    .getByRole('spinbutton', { name: 'Quantidade', exact: true })
    .filter({ visible: true });
  const box = await quantity.boundingBox();
  if (!box) throw new Error('Quantidade sem área clicável');
  expect(box.width).toBeGreaterThanOrEqual(isMobile ? 44 : 24);
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test('HTML inicial oferece feedback antes de carregar o JavaScript', async ({ page }) => {
  let releaseScripts: () => void = () => undefined;
  const scriptsReleased = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route('**/assets/*.js', async (route) => {
    await scriptsReleased;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.getByRole('status', { name: 'Carregando Kurio', exact: true })).toBeVisible();
    const family = await page
      .getByRole('status', { name: 'Carregando Kurio', exact: true })
      .evaluate((element) => getComputedStyle(element).fontFamily);
    expect(family).not.toContain('Roboto');
  } finally {
    releaseScripts();
  }
  await expect(page.getByTestId('home-hero')).toBeVisible();
  await expect(page.getByRole('status', { name: 'Carregando Kurio', exact: true })).toHaveCount(0);
});
