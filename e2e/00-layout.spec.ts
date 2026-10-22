import { expect, test } from './fixtures/kurio';

test.describe('layout global', () => {
  test('tem landmarks de header, navegação, conteúdo e rodapé', async ({ page }, testInfo) => {
    await page.goto('/');

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    const isMobile = testInfo.project.name.startsWith('mobile');
    await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible({
      visible: !isMobile,
    });
    await expect(page.getByRole('navigation', { name: 'Navegação móvel' })).toBeVisible({
      visible: isMobile,
    });
  });

  test('links fora do escopo não navegam e informam indisponibilidade', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('mobile'), 'nav principal só existe no desktop');
    await page.goto('/');

    await page.getByRole('navigation', { name: 'Principal' }).getByText('Criadores').click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Página não incluída nesta entrega')).toBeVisible();
  });

  test('newsletter não simula sucesso', async ({ page }) => {
    await page.goto('/');
    const newsletter = page.getByRole('form', { name: 'Newsletter' });

    await newsletter.getByLabel('E-mail para novidades').fill('ana@kurio.test');
    await newsletter.getByRole('button', { name: 'Enviar' }).click();

    await expect(page.getByText('Newsletter indisponível nesta demonstração')).toBeVisible();
    await expect(page.getByText(/inscrição confirmada/i)).toHaveCount(0);
  });

  test('rota inexistente mostra 404 com link para o início', async ({ page }) => {
    await page.goto('/rota-que-nao-existe');

    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
    await page.getByRole('link', { name: 'Voltar ao início' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('sessão expirada em rota privada redireciona preservando returnTo', async ({
    page,
    kurio,
  }) => {
    await kurio.loginAs('ana');
    await kurio.setScenario('session-expired');

    await page.goto('/account/profile');

    await expect(page).toHaveURL(/\/login\?returnTo=%2Faccount%2Fprofile/);
    await expect(page.getByText('Sua sessão expirou')).toBeVisible();
  });

  test('usuário autenticado vê o próprio nome no header e consegue sair', async ({
    page,
    kurio,
  }) => {
    await kurio.loginAs('ana');
    await page.goto('/');
    const banner = page.getByRole('banner');

    await banner.getByRole('button', { name: /Ana Ribeiro/ }).click();
    await page.getByRole('menuitem', { name: 'Sair' }).click();

    await expect(banner.getByRole('link', { name: 'Entrar' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('kurio.session'))).toBeNull();
  });
});
