import { addNft, prepareCheckout, reviewAndConnect } from './fixtures/checkout';
import { expect, login, test } from './fixtures/kurio';

test('Home preserva busca e posições dos ícones mobile do Figma', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Frame mobile de 414 px');
  await page.setViewportSize({ width: 414, height: 896 });
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Buscar NFTs' });
  await expect(search).toHaveCSS('font-size', '14px');
  await expect(search).toHaveCSS('height', '45px');
  const nav = page.getByRole('navigation', { name: 'Navegação mobile' });
  for (const [label, center] of [
    ['Favoritos', 118],
    ['Abrir carrinho, 0 itens', 301.5],
  ] as const) {
    const box = await nav
      .getByRole('link', { name: label, exact: true })
      .locator('svg')
      .boundingBox();
    expect(box && Math.abs(box.x + box.width / 2 - center) < 1).toBe(true);
  }
});

test('Home desktop usa slider laranja e tipografia do rodapé original', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Controles e rodapé desktop');
  await page.goto('/');
  const thumb = page.getByRole('slider', { name: 'Preço mínimo', exact: true });
  await expect(thumb).toHaveCSS('background-color', 'rgb(210, 138, 76)');
  await expect(page.getByTestId('footer-features').getByRole('heading').first()).toHaveCSS(
    'font-size',
    '17px',
  );
  await expect(page.getByTestId('footer-links').getByRole('heading').first()).toHaveCSS(
    'font-size',
    '18px',
  );
  const enter = page.getByRole('banner').getByRole('link', { name: 'Entrar', exact: true });
  expect((await enter.boundingBox())?.y).toBe(24);
  await expect(page.getByText('NFT EM DESTAQUE', { exact: true })).toHaveCSS('font-size', '24px');
  await expect(page.getByRole('button', { name: 'Página 2', exact: true })).toHaveCSS(
    'border-top-color',
    'rgb(63, 35, 25)',
  );
  await expect(page.getByRole('button', { name: 'Página 1', exact: true })).toHaveCSS(
    'background-color',
    'rgb(210, 138, 76)',
  );
  await expect(page.getByRole('heading', { name: 'Faixa de preço', exact: true })).toHaveCSS(
    'font-size',
    '18px',
  );
  await expect(page.getByRole('heading', { name: 'Diário da Cunhagem', exact: true })).toHaveCSS(
    'font-size',
    '28px',
  );
});

test('login e cadastro preservam formas e tipografia sem reduzir alvos de toque', async ({
  page,
  isMobile,
}) => {
  if (isMobile) await page.setViewportSize({ width: 414, height: 896 });
  for (const route of ['/login', '/register']) {
    await page.goto(route);
    await expect(page.getByRole('dialog')).toBeVisible();
    if (!isMobile) expect((await page.getByRole('dialog').boundingBox())?.y).toBe(160);
    await expect(page.getByLabel('E-mail', { exact: true })).toHaveCSS(
      'border-radius',
      isMobile ? '10px' : '5px',
    );
    await expect(
      page.getByRole('button', { name: 'Mostrar senha', exact: true }).locator('svg'),
    ).toHaveCSS('width', '20px');
    const social = page.getByRole('button', { name: 'Continuar com Google', exact: true });
    await expect(social).toHaveCSS('font-size', '13px');
    await expect(social).toHaveCSS('border-top-color', 'rgb(63, 35, 25)');
    if (isMobile) expect((await social.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    await expect(page.getByRole('button', { name: 'Fechar', exact: true })).toHaveCSS(
      'color',
      'rgb(210, 138, 76)',
    );
  }
  if (isMobile) {
    await page.goto('/login');
    expect((await page.getByRole('button', { name: 'Entrar', exact: true }).boundingBox())?.y).toBe(
      492,
    );
  }
});

test('carrinho usa margens mobile e cupom desktop do frame correspondente', async ({
  page,
  isMobile,
}) => {
  if (isMobile) await page.setViewportSize({ width: 414, height: 896 });
  await addNft(page, isMobile);
  const item = page.getByTestId('cart-item');
  if (isMobile) {
    const box = await item.boundingBox();
    expect(box?.x).toBe(28);
    expect(box?.y).toBe(88);
    expect(box?.width).toBe(358);
  } else {
    const coupon = page.getByRole('textbox', { name: 'Código promocional', exact: true });
    await expect(coupon.locator('..')).toHaveCSS('border-top-color', 'rgb(210, 138, 76)');
    await expect(coupon).toHaveCSS('font-size', '12px');
    await expect(page.getByRole('columnheader', { name: 'NFTs', exact: true })).toHaveCSS(
      'border-bottom-width',
      '1px',
    );
  }
});

test('perfil e carteiras usam indicadores de obrigação e formas originais', async ({ page }) => {
  await login(page);
  const name = page.getByLabel('Nome de exibição', { exact: true });
  await expect(name).toHaveAttribute('aria-required', 'true');
  await expect(name).toHaveCSS('border-radius', '3px');
  await expect(page.getByRole('button', { name: 'Alterar', exact: true })).toHaveCSS(
    'font-size',
    '14px',
  );
  await page.goto('/account/wallets');
  const network = page.getByRole('combobox', { name: 'Rede', exact: true });
  await expect(network).toHaveCSS('appearance', 'none');
  await expect(network.locator('..').locator('use')).toHaveAttribute(
    'href',
    '/images/ui/figma-icons.svg#chevron-down',
  );
  const checkbox = page.getByLabel('Igual à carteira principal', { exact: true });
  expect(
    await checkbox.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius)),
  ).toBeGreaterThanOrEqual(8);
  await expect(checkbox).toHaveCSS('appearance', 'none');
});

test('pagamento reproduz cartões e indicadores de seleção por breakpoint', async ({
  page,
  isMobile,
}) => {
  if (isMobile) await page.setViewportSize({ width: 414, height: 896 });
  await prepareCheckout(page, isMobile);
  const provider = page
    .getByRole('radiogroup', { name: 'Provedor da carteira' })
    .getByRole('radio', { name: 'MetaMask', exact: true });
  await expect(provider).toHaveCSS('height', isMobile ? '65px' : '45px');
  if (isMobile) {
    const wallet = page
      .getByRole('radiogroup', { name: 'Carteira cadastrada' })
      .getByRole('radio')
      .first();
    await expect(wallet).toHaveCSS('height', '93px');
    expect((await wallet.boundingBox())?.y).toBe(124);
    await expect(wallet).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    await expect(
      page.getByRole('radio', { name: 'Coinbase Wallet', exact: true }).locator('use'),
    ).toHaveAttribute('href', '/images/ui/figma-icons.svg#wallet');
  } else {
    await expect(provider).toHaveCSS('border-top-color', 'rgb(210, 138, 76)');
    const indicator = await provider.locator('[data-testid="selection-indicator"]').boundingBox();
    const label = await provider.getByText('MetaMask', { exact: true }).boundingBox();
    expect(indicator && label && indicator.x < label.x).toBe(true);
  }
});

test('recibo usa cabeçalhos e taxa nas cores e tamanhos do Figma', async ({ page, isMobile }) => {
  await prepareCheckout(page, isMobile);
  await reviewAndConnect(page);
  await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
  ).toBeVisible();
  const header = page
    .getByTestId('order-items')
    .getByRole('columnheader', { name: 'NFTs', exact: true });
  await expect(header).toHaveCSS('color', 'rgb(245, 241, 235)');
  await expect(header).toHaveCSS('font-weight', '700');
  await expect(
    page.getByRole('link', { name: 'Ver no Etherscan (simulado)', exact: true }),
  ).toHaveCSS('min-height', '48px');
  await expect(page.getByRole('button', { name: 'Fechar', exact: true })).toHaveCSS(
    'color',
    'rgb(210, 138, 76)',
  );
});
