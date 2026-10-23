import { test, expect, login } from './fixtures/kurio';

test.describe('auth', () => {
  test('cadastro válido preserva carrinho e permite login da conta criada', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/nfts/nft-001');
    await page
      .getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true })
      .click();
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await page.goto('/register?returnTo=%2Fcart');
    await page.getByLabel('Nome de usuário', { exact: true }).fill('nova_colecao');
    await page.getByLabel('E-mail', { exact: true }).fill('nova_colecao@kurio.test');
    await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
    await page.getByLabel('Confirmar senha', { exact: true }).fill('Kurio!2026');
    await page
      .getByRole('button', { name: isMobile ? 'Criar perfil' : 'Criar conta', exact: true })
      .click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await page.reload();
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await page.goto('/account/profile');
    await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue('nova_colecao');
    await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
    await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4175/');
    await login(page, 'nova_colecao');
    await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue('nova_colecao');
    await page.goto('/cart');
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
  });

  test('cadastro com e-mail existente mostra conflito no campo', async ({ page, isMobile }) => {
    await page.goto('/register');
    await page.getByLabel('Nome de usuário', { exact: true }).fill('nova_ana');
    await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
    await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
    await page.getByLabel('Confirmar senha', { exact: true }).fill('Kurio!2026');
    await page
      .getByRole('button', { name: isMobile ? 'Criar perfil' : 'Criar conta', exact: true })
      .click();
    await expect(page.getByText('Este e-mail já está cadastrado', { exact: true })).toBeVisible();
  });
  test('login inválido mostra erro acessível', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
    await page.getByLabel('Senha', { exact: true }).fill('errada');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('E-mail ou senha incorretos');
  });
  test('login válido volta para returnTo e persiste após refresh', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/account\/profile/);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Abrir menu da conta', exact: true }),
    ).toBeVisible();
  });
  test('sessão expirada redireciona e preserva returnTo', async ({ page }) => {
    await login(page);
    await page.evaluate(() => {
      window.__kurio.setScenario('session-expired');
    });
    await page.goto('/account/profile');
    await expect(page).toHaveURL(/\/login\?returnTo=/);
    await expect(page.getByLabel('E-mail', { exact: true })).toBeVisible();
    await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
    await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page).toHaveURL(/\/account\/profile/);
  });
  test('logout limpa dados privados e permite entrar como outro usuário', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
    await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4175/');
    await expect(page.getByRole('button', { name: 'Abrir menu da conta' })).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem('kurio.session'))).toBeNull();
    await login(page, 'bruno');
    await expect(
      page.getByRole('main').getByLabel('Nome de exibição', { exact: true }),
    ).toHaveValue('Bruno Santos');
    await expect(page.getByText('Ana Costa', { exact: true })).toHaveCount(0);
  });
  test('returnTo externo é normalizado para início', async ({ page }) => {
    await page.goto('/login?returnTo=https://example.com');
    await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
    await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4175/');
  });
});

test('carrinho de visitante é preservado ao entrar e não vaza para outro usuário', async ({
  page,
  isMobile,
}) => {
  await page.goto('/nfts/nft-001');
  await page
    .getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true })
    .click();
  if (isMobile) await expect(page.getByTestId('cart-item')).toHaveCount(1);
  else
    await expect(page.getByRole('link', { name: 'Carrinho, 1 item', exact: true })).toBeVisible();
  await login(page);
  await expect(page.getByRole('link', { name: 'Carrinho, 1 item', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4175/');
  await expect(page.getByRole('button', { name: 'Abrir menu da conta' })).toHaveCount(0);
  await login(page, 'bruno');
  await expect(page.getByRole('link', { name: 'Carrinho, 0 itens', exact: true })).toBeVisible();
});
