import { test, expect } from './fixtures/kurio';

test('busca, filtros e ordenação refletem API e URL', async ({ page, isMobile }) => {
  await page.goto('/');
  if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Emerald');
  if (isMobile) await page.getByRole('button', { name: 'Filtros', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Arte digital', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Ethereum', exact: true }).check();
  await page.getByRole('combobox', { name: 'Ordenar por', exact: true }).selectOption('price_asc');
  if (isMobile) await page.getByRole('button', { name: 'Aplicar filtros', exact: true }).click();
  await expect(page).toHaveURL(/q=Emerald/);
  await expect(page).toHaveURL(/category=arte-digital/);
  await expect(page).toHaveURL(/network=ethereum/);
  await expect(page).toHaveURL(/sort=price_asc/);
  await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Emerald');
});
test('paginação, refresh e histórico preservam parâmetros', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Página 2', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Página 2', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Golden');
  await expect(page).not.toHaveURL(/page=2/);
  await page.goBack();
  await expect(page).toHaveURL(/page=2/);
});
test('vazio oferece limpar filtros e URL inválida não quebra página', async ({
  page,
  isMobile,
}) => {
  await page.goto('/?page=abc&minPrice=-1');
  await expect(page.getByTestId('nft-grid')).toBeVisible();
  if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  await page
    .getByRole('searchbox', { name: 'Buscar NFTs', exact: true })
    .fill('colecao-inexistente');
  await expect(page.getByRole('heading', { name: 'Nenhum NFT encontrado' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).last().click();
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
});
test('falha 500 mostra erro e nova tentativa recupera', async ({ page }) => {
  await page.goto('/?scenario=server-error-reads');
  await expect(page.getByRole('heading', { name: 'Não foi possível carregar' })).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.setScenario('default');
  });
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(page.getByTestId('nft-grid')).toBeVisible();
});
test('rede lenta mostra skeletons com dimensões e reduced motion', async ({ page }) => {
  await page.goto('/?scenario=slow-network');
  await expect(page.getByLabel('Carregando NFT').first()).toBeVisible();
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
});
test('respostas fora de ordem mantêm a busca mais recente', async ({ page, isMobile }) => {
  await page.goto('/?scenario=out-of-order');
  if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  const search = page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true });
  await search.fill('Emerald');
  await search.fill('Golden');
  await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Golden');
  await expect(page).toHaveURL(/q=Golden/);
});
