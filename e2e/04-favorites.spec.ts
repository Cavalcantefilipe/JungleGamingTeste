import { test, expect, login } from './fixtures/kurio';

test('favoritar persiste após refresh e aba lista apenas favoritos', async ({ page }) => {
  await login(page, 'ana', '/');
  const button = page.getByRole('button', { name: 'Favoritar Sage Nomad #009', exact: true });
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(button).toBeEnabled();
  await page.reload();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/?favorites=true');
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(4);
  await expect(page.getByTestId('nft-grid')).toContainText('Sage Nomad #009');
  await button.click();
  await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(3);
});

test('falha reverte visual otimista e avisa', async ({ page }) => {
  await login(page, 'ana', '/');
  const button = page.getByRole('button', { name: 'Favoritar Sage Nomad #009', exact: true });
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => {
    window.__kurio.setScenario('favorite-mutation-fails');
    window.__kurio.setNetwork({ latencyMs: 800 });
  });
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByText('Não foi possível atualizar favoritos.', { exact: true }),
  ).toBeVisible();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('favorito de Ana não aparece para Bruno e socket troca de sessão', async ({ page }) => {
  await login(page, 'ana');
  await expect
    .poll(() => page.evaluate(() => window.__kurio.getConnections()))
    .toEqual(['user-ana']);
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('/');
  await login(page, 'bruno', '/?favorites=true');
  await expect
    .poll(() => page.evaluate(() => window.__kurio.getConnections()))
    .toEqual(['user-bruno']);
  await expect(page.getByRole('heading', { name: 'Nenhum NFT encontrado' })).toBeVisible();
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Favoritar Emerald Ape #042', exact: true }),
  ).toHaveAttribute('aria-pressed', 'false');
});

test('visitante volta ao detalhe após login para favoritar', async ({ page, isMobile }) => {
  await page.goto('/nfts/nft-002');
  await page
    .getByRole('button', { name: 'Favoritar Sage Nomad #009', exact: true })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await page.getByLabel('E-mail', { exact: true }).fill('bruno@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/nfts\/nft-002/);
  const button = page
    .getByRole('button', { name: 'Favoritar Sage Nomad #009', exact: true })
    .filter({ visible: true });
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  if (isMobile) await expect(page.getByTestId('mobile-purchase-bar')).toBeVisible();
});

test('falhas simultâneas revertem cada favorito sem recuperar estado antigo de outro item', async ({
  page,
}) => {
  await login(page, 'ana', '/');
  const sage = page.getByRole('button', { name: 'Favoritar Sage Nomad #009', exact: true });
  const cosmic = page.getByRole('button', { name: 'Favoritar Cosmic Bloom #118', exact: true });
  await expect(sage).toHaveAttribute('aria-pressed', 'false');
  await expect(cosmic).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => {
    window.__kurio.setScenario('favorite-mutation-fails');
    window.__kurio.setNetwork({ latencyMs: 800 });
  });
  await sage.click();
  await cosmic.click();
  await expect(sage).toHaveAttribute('aria-pressed', 'true');
  await expect(cosmic).toHaveAttribute('aria-pressed', 'true');
  await expect(sage).toHaveAttribute('aria-pressed', 'false');
  await expect(cosmic).toHaveAttribute('aria-pressed', 'false');
  await expect(cosmic).toBeEnabled();
  await expect(sage).toHaveAttribute('aria-pressed', 'false');
});
