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

test('controles e resumo do carrinho seguem cores e formas medidas no Figma', async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto('/nfts/nft-001');
  await page
    .getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true })
    .click();
  await expect(page.getByTestId('quote-total')).toHaveText('1.206 ETH');
  const row = page.getByTestId('cart-item');
  const increase = row.getByRole('button', { name: 'Aumentar quantidade', exact: true });
  const circle = await increase.evaluate((element) => {
    const style = getComputedStyle(element, '::before');
    return {
      width: style.width,
      height: style.height,
      radius: Number.parseFloat(style.borderRadius),
      background: style.backgroundColor,
      border: style.borderTopColor,
    };
  });
  expect(circle).toMatchObject({
    width: '24px',
    height: '24px',
    background: 'rgb(47, 29, 21)',
    border: 'rgb(63, 35, 25)',
  });
  expect(circle.radius).toBeGreaterThanOrEqual(12);
  await expect(row.getByRole('button', { name: 'Remover Emerald Ape #042' })).toHaveCSS(
    'color',
    'rgb(210, 138, 76)',
  );
  const caption = page.getByText('Taxa estimada', { exact: true });
  await expect(caption).toHaveCSS('font-size', '12px');
  await expect(caption).toHaveCSS('line-height', '16px');
  await expect(caption).toHaveCSS('color', 'rgb(232, 155, 85)');
  const fee = await page.getByTestId('quote-network-fee').boundingBox();
  const label = await caption.boundingBox();
  expect(fee && label && label.y >= fee.y + fee.height).toBe(true);
  expect(fee && label && Math.abs(fee.x + fee.width - label.x - label.width) < 1).toBe(true);
  const checkout = page.getByRole('link', { name: 'Conectar e finalizar', exact: true });
  await expect(checkout).toHaveCSS('background-image', /primary-button-gradient\.svg/);
  if (isMobile) {
    await expect(checkout).toHaveCSS('height', '60px');
    await expect(page.getByRole('complementary', { name: 'Resumo da carteira' })).toHaveCSS(
      'border-top-left-radius',
      '40px',
    );
    await expect(row.getByRole('heading')).toHaveCSS('font-size', '15px');
    const target = await increase.boundingBox();
    expect(target?.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: testInfo.outputPath('cart-figma.png'), fullPage: true });
});
