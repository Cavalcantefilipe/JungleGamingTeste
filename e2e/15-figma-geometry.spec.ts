import { test, expect } from './fixtures/kurio';

test('topo da Home segue as medidas dos frames do Figma', async ({ page, isMobile }) => {
  await page.goto('/');
  const hero = page.getByTestId('home-hero');
  const box = await hero.boundingBox();
  expect(box?.height).toBeCloseTo(isMobile ? 190 : 450, 0);
  if (isMobile) {
    await expect(
      page.getByRole('heading', { name: 'SEJA DONO DA CULTURA DIGITAL', exact: true }),
    ).toHaveCSS('font-size', '18px');
    const search = await page
      .getByRole('searchbox', { name: 'Buscar NFTs', exact: true })
      .boundingBox();
    expect(search && box && search.y < box.y).toBe(true);
  } else {
    await expect(page.getByRole('link', { name: 'Kurio — Início', exact: true })).toHaveCSS(
      'font-size',
      '14px',
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('line-height', '70px');
    expect(box?.y).toBeCloseTo(101, 0);
  }
});

test('detalhe mobile segue painel e título do Figma', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/nfts/nft-001');
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042', exact: true })).toHaveCSS(
    'font-size',
    '20px',
  );
  await expect(page.getByTestId('detail-summary')).toHaveCSS('background-color', 'rgb(36, 22, 18)');
  await expect(page.getByTestId('mobile-purchase-bar')).toHaveCSS('border-top-left-radius', '32px');
});
