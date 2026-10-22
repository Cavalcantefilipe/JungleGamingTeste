import { expect, SEED_USERS, test } from './fixtures/kurio';

test.describe('conta e sessão', () => {
  test('cadastro com e-mail existente mostra conflito no campo', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Nome de usuário').fill('ana_nova');
    await page.getByLabel('E-mail').fill(SEED_USERS.ana.email);
    await page.getByLabel('Senha', { exact: true }).fill('Senha123');
    await page.getByLabel('Confirmar senha').fill('Senha123');
    await page.getByRole('button', { name: /criar (conta|perfil)/i }).click();

    await expect(page.getByText('Este e-mail já está cadastrado')).toBeVisible();
    await expect(page.getByLabel('E-mail')).toHaveAttribute('aria-invalid', 'true');
  });

  test('login inválido mostra erro acessível', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('E-mail').fill(SEED_USERS.ana.email);
    await page.getByLabel('Senha', { exact: true }).fill('senha-errada1');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(page.getByRole('alert')).toContainText('E-mail ou senha incorretos');
  });

  test('login válido volta para returnTo', async ({ page }) => {
    await page.goto('/login?returnTo=%2F%3Ftab%3Dnew');

    await page.getByLabel('E-mail').fill(SEED_USERS.ana.email);
    await page.getByLabel('Senha', { exact: true }).fill(SEED_USERS.ana.password);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(page).toHaveURL(/\/\?tab=new$/);
    await expect(page.getByRole('dialog')).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem('kurio.session'))).toContain(
      'ana@kurio.test',
    );
  });

  test('returnTo externo é ignorado', async ({ page }) => {
    await page.goto('/login?returnTo=https%3A%2F%2Fexemplo.com');

    await page.getByLabel('E-mail').fill(SEED_USERS.bruno.email);
    await page.getByLabel('Senha', { exact: true }).fill(SEED_USERS.bruno.password);
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(page).toHaveURL(/\/$/);
  });

  test('cadastro válido autentica e volta ao início', async ({ page, kurio }) => {
    await page.goto('/register');

    await page.getByLabel('Nome de usuário').fill('carla');
    await page.getByLabel('E-mail').fill('carla@kurio.test');
    await page.getByLabel('Senha', { exact: true }).fill('Senha123');
    await page.getByLabel('Confirmar senha').fill('Senha123');
    await page.getByRole('button', { name: /criar (conta|perfil)/i }).click();

    await expect(page).toHaveURL(/\/$/);
    const state = await kurio.getState();
    expect(state.users.map((user) => user.email)).toContain('carla@kurio.test');
  });
});
