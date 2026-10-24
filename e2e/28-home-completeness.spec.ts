import { expect, test } from './fixtures/kurio';

test('busca inclui o criador anunciado na interface', async ({ page, isMobile }) => {
  await page.goto('/');
  if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Nova Sato');
  await expect(page).toHaveURL(/q=Nova\+Sato/);
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  await page.getByTestId('nft-grid').getByRole('link').first().click();
  await expect(page.getByText(/Nova Sato recebe 5%/)).toBeVisible();
});

test('página fora do intervalo recupera última página e URL sem perder filtros', async ({
  page,
}) => {
  await page.goto('/?page=999&network=ethereum&sort=price_asc');
  await expect(page).toHaveURL(/page=2/);
  await expect(page).toHaveURL(/network=ethereum/);
  await expect(page).toHaveURL(/sort=price_asc/);
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  await expect(page.getByRole('button', { name: 'Página 2', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.reload();
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  await page.getByRole('button', { name: 'Página 1', exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/page=2/);
});

test('Entrar no cabeçalho preserva filtros e retorna ao catálogo após autenticar', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Cabeçalho desktop');
  await page.goto('/?q=Emerald&network=ethereum#catalogo');
  await page.getByRole('link', { name: 'Entrar', exact: true }).click();
  expect(new URL(page.url()).searchParams.get('returnTo')).toBe(
    '/?q=Emerald&network=ethereum#catalogo',
  );
  await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/q=Emerald&network=ethereum#catalogo$/);
});

test('abas do catálogo aceitam setas, Home e End com foco único', async ({ page }) => {
  await page.goto('/');
  const all = page.getByRole('tab', { name: 'Todos os NFTs', exact: true });
  const latest = page.getByRole('tab', { name: 'Novos lançamentos', exact: true });
  const trending = page.getByRole('tab', { name: 'Em alta', exact: true });
  await all.focus();
  await page.keyboard.press('ArrowRight');
  await expect(latest).toBeFocused();
  await expect(latest).toHaveAttribute('aria-selected', 'true');
  await expect(all).toHaveAttribute('tabindex', '-1');
  await page.keyboard.press('End');
  await expect(trending).toBeFocused();
  await expect(page).toHaveURL(/tab=trending/);
  await page.keyboard.press('Home');
  await expect(all).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Todos os NFTs', exact: true })).toBeVisible();
});

test('cards preservam tipografia desktop e mobile do Figma', async ({ page, isMobile }) => {
  await page.goto('/');
  const card = page.getByTestId('nft-grid').getByRole('article').first();
  await expect(card.getByRole('heading')).toHaveCSS('font-size', isMobile ? '15px' : '16px');
  await expect(card.getByText('1.19 ETH', { exact: true })).toHaveCSS(
    'font-size',
    isMobile ? '16px' : '18px',
  );
  await page.goto('/nfts/nft-004');
  const related = page.getByRole('region', { name: 'Mais desta coleção', exact: true });
  await expect(related.getByRole('heading', { level: 3 }).first()).toHaveCSS('font-size', '15px');
});

test('página fora do intervalo sem resultados exibe estado vazio recuperável', async ({ page }) => {
  await page.goto('/?q=inexistente&page=999');
  await expect(page).not.toHaveURL(/page=999/);
  await expect(
    page.getByRole('heading', { name: 'Nenhum NFT encontrado', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('tabpanel')
    .getByRole('button', { name: 'Limpar filtros', exact: true })
    .click();
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
});

test('falha editorial oferece nova tentativa e recupera conteúdo original do Figma', async ({
  page,
}) => {
  await page.goto('/?scenario=server-error-reads');
  const editorial = page.getByRole('region', { name: 'Conteúdo editorial', exact: true });
  await expect(
    editorial.getByRole('heading', { name: 'Conteúdo editorial indisponível', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.setScenario('default');
  });
  await editorial
    .getByRole('button', { name: 'Recarregar conteúdo editorial', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: '10 artistas digitais para acompanhar', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Raridade, atributos e procedência', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('15 de setembro | Leitura de 3 min', { exact: true })).toBeVisible();
});

test('coleções do rodapé usam o filtro disponível no catálogo', async ({ page }) => {
  await page.goto('/');
  await page
    .getByTestId('footer-links')
    .getByRole('link', { name: 'Fotografia', exact: true })
    .click();
  await expect(page).toHaveURL(/category=fotografia/);
  await expect(page).toHaveURL(/#catalogo$/);
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(6);
});
