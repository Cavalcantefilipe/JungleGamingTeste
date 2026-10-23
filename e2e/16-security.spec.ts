import { expect, login, test } from './fixtures/kurio';

test('texto salvo no perfil não vira HTML ou código ao reaparecer no menu', async ({ page }) => {
  await login(page);
  const text = '<img src=x onerror="window.__xssProbe=1">';
  await page.getByLabel('Nome de exibição', { exact: true }).fill(text);
  await page.getByRole('button', { name: 'Salvar perfil', exact: true }).click();
  await expect(page.getByText('Perfil atualizado.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await expect(page.getByRole('menu').getByText(text, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => Object.hasOwn(window, '__xssProbe'))).toBe(false);
  expect(await page.locator('[onerror]').count()).toBe(0);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue(text);
  expect(await page.evaluate(() => Object.hasOwn(window, '__xssProbe'))).toBe(false);
});

test('identidade adulterada não exibe dados do dono do token', async ({ page }) => {
  await login(page);
  await page.evaluate(() => {
    const raw = localStorage.getItem('kurio.session');
    if (!raw) throw new Error('Sessão ausente');
    const session = JSON.parse(raw) as { user: { id: string } };
    session.user.id = 'user-bruno';
    localStorage.setItem('kurio.session', JSON.stringify(session));
  });
  await page.reload();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('kurio.session'))).toBeNull();
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveCount(0);
});
