import { test, expect, login } from './fixtures/kurio';

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
    const grid = page.getByTestId('nft-grid');
    expect((await grid.boundingBox())?.width).toBe(842);
    expect((await grid.getByRole('img').first().boundingBox())?.width).toBe(250);
    expect((await grid.getByRole('article').first().boundingBox())?.height).toBe(356);
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
  if (!isMobile) {
    await expect(row.getByRole('heading')).toHaveCSS('font-size', '16px');
    await expect(page.getByRole('heading', { name: 'Resumo da carteira' })).toHaveCSS(
      'font-size',
      '18px',
    );
  }
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
    isMobile ? 'rgb(210, 138, 76)' : 'rgb(179, 148, 99)',
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
  await expect(checkout).toHaveCSS(
    'background-image',
    /linear-gradient\(108\.86deg, rgb\(210, 138, 76\)/,
  );
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

test('autenticação segue painel, marca mobile e botões sociais do Figma', async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto('/login');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Entrar', exact: true })).toBeAttached();
  if (isMobile) {
    const logo = dialog.getByRole('link', { name: 'Kurio — Início', exact: true });
    await expect(logo).toHaveCSS('font-size', '32px');
    await expect(logo).toHaveCSS('color', 'rgb(245, 241, 235)');
    await expect(logo).toHaveCSS('letter-spacing', '3.2px');
  } else {
    const box = await dialog.boundingBox();
    expect(box?.width).toBe(500);
    expect(box?.height).toBe(600);
    await expect(dialog).toHaveCSS('background-color', 'rgb(36, 22, 18)');
    await expect(dialog).toHaveCSS('border-top-left-radius', '0px');
  }
  const google = dialog.getByRole('button', { name: 'Continuar com Google', exact: true });
  const facebook = dialog.getByRole('button', { name: 'Continuar com Facebook', exact: true });
  const first = await google.boundingBox();
  const second = await facebook.boundingBox();
  expect(first && second && second.y >= first.y + first.height).toBe(true);
  await expect(google.locator('img')).toHaveAttribute('src', '/images/ui/google.svg');
  await expect(facebook.locator('img')).toHaveAttribute('src', '/images/ui/facebook.svg');
  await page.getByLabel('Senha', { exact: true }).fill('SenhaVisivel!2026');
  await page.getByRole('button', { name: 'Mostrar senha', exact: true }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Ocultar senha', exact: true }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'password');
  await page.screenshot({ path: testInfo.outputPath('login-figma.png') });
});

test('cadastro confirma senha antes de enviar e respeita viewport', async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto('/register');
  await page.getByLabel('Nome de usuário', { exact: true }).fill('nova_colecao');
  await page.getByLabel('E-mail', { exact: true }).fill('nova@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByLabel('Confirmar senha', { exact: true }).fill('OutraSenha!2026');
  await page
    .getByRole('button', { name: isMobile ? 'Criar perfil' : 'Criar conta', exact: true })
    .click();
  await expect(page.getByText('As senhas precisam ser iguais', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__kurio.getState().users.length)).toBe(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('register-figma.png') });
});

test('galeria desktop mantém proporções e espaçamento do detalhe no Figma', async ({
  page,
  isMobile,
}, testInfo) => {
  test.skip(isMobile, 'Medidas do frame desktop');
  await page.goto('/nfts/nft-001');
  const image = page.getByTestId('gallery-image');
  await expect(image).toBeVisible();
  const box = await image.boundingBox();
  expect(box?.width).toBe(404);
  expect(box?.height).toBe(404);
  const thumbnails = page.getByRole('button', { name: /Ver imagem/ });
  await expect(thumbnails).toHaveCount(4);
  const thumb = await thumbnails.first().boundingBox();
  expect(thumb?.width).toBe(100);
  const summary = await page.getByTestId('detail-summary').boundingBox();
  expect(summary?.x).toBe(725);
  expect(summary?.height).toBeLessThanOrEqual(448);
  await expect(page.getByTestId('nft-price')).toHaveCSS('font-size', '24px');
  await page.screenshot({ path: testInfo.outputPath('detail-figma.png') });
});

test('rodapé compartilhado mantém textos e faixas do Figma', async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(
    footer.getByRole('heading', { name: 'Segurança da carteira', exact: true }),
  ).toBeVisible();
  await expect(
    footer.getByRole('heading', { name: 'Alertas de lançamentos', exact: true }),
  ).toBeVisible();
  if (!isMobile) {
    expect((await footer.getByTestId('footer-features').boundingBox())?.height).toBe(250);
    expect((await footer.getByTestId('footer-brand').boundingBox())?.height).toBe(88);
    expect((await footer.getByTestId('footer-links').boundingBox())?.height).toBe(236);
    await expect(footer.getByTestId('footer-medallion').first()).toHaveCSS('width', '74px');
  }
  await footer.scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await footer.screenshot({ path: testInfo.outputPath('footer-figma.png') });
  await footer.getByLabel('E-mail para newsletter', { exact: true }).fill('colecao@kurio.test');
  await footer.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(
    page.getByText('Newsletter indisponível nesta demonstração', { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('perfil mantém controles de senha, botões e alinhamento da conta', async ({
  page,
  isMobile,
}) => {
  await login(page);
  await expect(page.getByText('Nome de exibição', { exact: true })).toHaveCSS('font-size', '14px');
  const currentPassword = page.getByLabel('Senha atual', { exact: true });
  await currentPassword.fill('Kurio!2026');
  await page.getByRole('button', { name: 'Mostrar senha atual', exact: true }).click();
  await expect(currentPassword).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Ocultar senha atual', exact: true }).click();
  await expect(currentPassword).toHaveAttribute('type', 'password');
  await expect(page.getByRole('button', { name: 'Salvar perfil', exact: true })).toHaveCSS(
    'font-size',
    '12px',
  );
  if (!isMobile) {
    const profile = await page.getByLabel('Nome de exibição', { exact: true }).boundingBox();
    const password = await currentPassword.boundingBox();
    expect(password?.width).toBe(profile?.width);
    const sidebar = await page.getByRole('complementary').boundingBox();
    const selected = await page
      .getByRole('link', { name: 'Dados do perfil', exact: true })
      .boundingBox();
    expect(selected?.x).toBe(sidebar?.x);
  }
});

test('links do rodapé ficam inteiros dentro da faixa de fundo', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Faixa fixa do frame desktop');
  await page.goto('/');
  const panel = page.getByTestId('footer-links');
  const last = panel.getByRole('link', { name: 'Lista de interesse', exact: true });
  await expect(page.getByTestId('nft-grid').getByRole('article')).toHaveCount(9);
  await expect(last).toBeAttached();
  const inset = await panel.evaluate((element) => {
    const link = Array.from(element.querySelectorAll('a')).find(
      (candidate) => candidate.textContent.trim() === 'Lista de interesse',
    );
    if (!link) throw new Error('Link do rodapé ausente');
    return element.getBoundingClientRect().bottom - link.getBoundingClientRect().bottom;
  });
  expect(inset).toBeGreaterThanOrEqual(12);
});

test('valor alto no carrinho mobile não encosta no controle de quantidade', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Preço e controles compartilham linha no frame mobile');
  await page.goto('/nfts/nft-006');
  await page.getByRole('button', { name: 'ABERTA', exact: true }).click();
  const input = page.getByRole('spinbutton', { name: 'Quantidade', exact: true });
  await expect(input).toHaveAttribute('max', '99');
  await input.fill('99');
  await page.getByRole('button', { name: 'Comprar NFT', exact: true }).click();
  const row = page.getByTestId('cart-item');
  const price = row.getByText('177.21 ETH', { exact: true });
  await expect(price).toBeVisible();
  const amount = await price.boundingBox();
  const control = await row.getByRole('button', { name: 'Diminuir quantidade' }).boundingBox();
  if (!amount || !control) throw new Error('Valor ou controle ausente');
  expect(amount.x + amount.width).toBeLessThanOrEqual(control.x - 2);
});

test('Home mobile preserva o desnível de 32px dos cards e botão auth tem raio de 12px', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Composição do frame mobile');
  await page.setViewportSize({ width: 414, height: 896 });
  await page.goto('/');
  const cards = page.getByTestId('nft-grid').getByRole('article');
  await expect(cards).toHaveCount(9);
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first?.y).toBeCloseTo(343, -1);
  expect(second && first && second.y - first.y).toBe(32);
  const favorite = cards.first().getByRole('button', { name: /Favoritar/ });
  expect((await favorite.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  const tabs = page.getByRole('tablist', { name: 'Catálogo' });
  expect((await tabs.getByRole('tab').first().boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await page.goto('/login');
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Entrar', exact: true }),
  ).toHaveCSS('border-top-left-radius', '12px');
});
