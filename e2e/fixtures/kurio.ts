import { test as base, expect, type Page } from '@playwright/test';

export async function login(page: Page, user = 'ana', returnTo = '/account/profile') {
  await page.goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  await page.getByLabel('E-mail', { exact: true }).fill(`${user}@kurio.test`);
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(returnTo);
  await expect(page.getByRole('dialog')).toHaveCount(0);
}
export const test = base.extend({
  page: async ({ page }, providePage) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('kurio.test.initialized')) {
        localStorage.clear();
        sessionStorage.setItem('kurio.test.initialized', 'true');
      }
    });
    await providePage(page);
  },
});
export { expect };
