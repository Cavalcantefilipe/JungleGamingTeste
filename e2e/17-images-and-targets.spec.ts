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

test('imagens editoriais mantêm o enquadramento e cards não ampliam no hover', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-grid').getByRole('article')).toHaveCount(9);
  const firstArtwork = page.getByTestId('nft-grid').getByRole('img').first();
  const before = await firstArtwork.boundingBox();
  await firstArtwork.hover();
  await expect(firstArtwork).toHaveCSS('transform', 'none');
  const after = await firstArtwork.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  const heading = page.getByRole('heading', { name: 'Diário da Cunhagem', exact: true });
  const journal = heading.locator('..').locator('..');
  const photo = journal.getByRole('img').first();
  await photo.scrollIntoViewIfNeeded();
  const box = await photo.boundingBox();
  expect(box && box.width / box.height).toBeCloseTo(268 / 195, 2);
});

test('ícones originais carregam sob a política de conteúdo da aplicação', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-grid').getByRole('article')).toHaveCount(9);
  const icons = page
    .locator('svg:has(use[href^="/images/ui/figma-icons.svg#"])')
    .filter({ visible: true });
  expect(await icons.count()).toBeGreaterThan(5);
  for (const icon of await icons.all()) {
    await expect
      .poll(() =>
        icon.evaluate((element) =>
          element instanceof SVGGraphicsElement ? element.getBBox().width : 0,
        ),
      )
      .toBeGreaterThan(0);
  }
});
