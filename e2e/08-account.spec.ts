import { readFile } from 'node:fs/promises';

import { test, expect, login } from './fixtures/kurio';

test('editar nome e e-mail persiste após refresh', async ({ page }) => {
  await login(page);
  await page.getByLabel('Nome de exibição', { exact: true }).fill('Ana Colecionadora');
  await page.getByLabel('E-mail', { exact: true }).fill('ana.nova@kurio.test');
  await page.getByRole('button', { name: 'Salvar perfil', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Perfil atualizado');
  await page.reload();
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue(
    'Ana Colecionadora',
  );
  await expect(page.getByLabel('E-mail', { exact: true })).toHaveValue('ana.nova@kurio.test');
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await expect(page.getByText('Ana Colecionadora', { exact: true })).toBeVisible();
});

test('username em conflito mostra erro associado ao campo', async ({ page }) => {
  await login(page);
  const input = page.getByLabel('Nome de usuário', { exact: true });
  await input.fill('bruno');
  await page.getByRole('button', { name: 'Salvar perfil', exact: true }).click();
  await expect(page.getByText('Este nome já está em uso', { exact: true })).toBeVisible();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('avatar rejeita pdf e tamanho excessivo; válido aparece no header e pode ser removido', async ({
  page,
}) => {
  await login(page);
  const input = page.getByLabel('Alterar avatar', { exact: true });
  await input.setInputFiles({
    name: 'arquivo.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF'),
  });
  await expect(page.getByRole('alert')).toContainText('até 2 MB');
  await input.setInputFiles({
    name: 'grande.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
  });
  await expect(page.getByRole('alert')).toContainText('até 2 MB');
  const original = await readFile('public/images/nfts/emerald-400.webp');
  const padding = Buffer.alloc(2 * 1024 * 1024 - 128 - original.length - 8);
  const chunk = Buffer.alloc(8);
  chunk.write('JUNK');
  chunk.writeUInt32LE(padding.length, 4);
  const image = Buffer.concat([original, chunk, padding]);
  image.writeUInt32LE(image.length - 8, 4);
  await input.setInputFiles({ name: 'avatar.webp', mimeType: 'image/webp', buffer: image });
  await expect(
    page.getByRole('button', { name: 'Abrir menu da conta' }).locator('img'),
  ).toHaveAttribute('src', /^data:image\//);
  await page.reload();
  await expect(page.getByAltText('Avatar do colecionador')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Abrir menu da conta' }).locator('img'),
  ).toHaveAttribute('src', /^data:image\//);
  await page.getByRole('button', { name: 'Remover avatar', exact: true }).click();
  await expect(page.getByAltText('Avatar do colecionador')).toHaveCount(0);
});

test('senha atual errada mostra erro; troca válida permite novo login', async ({ page }) => {
  await login(page);
  await page.getByLabel('Senha atual', { exact: true }).fill('senha-incorreta');
  await page.getByLabel('Nova senha', { exact: true }).fill('NovaSenha!2026');
  await page.getByLabel('Confirmar nova senha', { exact: true }).fill('NovaSenha!2026');
  await page.getByRole('button', { name: 'Alterar senha', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(1);
  await expect(page.getByRole('alert')).toContainText('Senha atual incorreta');
  await expect(page.getByLabel('Senha atual', { exact: true })).toBeFocused();
  await page.getByLabel('Senha atual', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Alterar senha', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Senha alterada');
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('button', { name: 'Abrir menu da conta' })).toHaveCount(0);
  await page.goto('/login');
  await page.getByLabel('E-mail', { exact: true }).fill('ana@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('NovaSenha!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login/);
});

test('carteira principal valida endereço e persiste; secundária igual espelha alterações', async ({
  page,
}) => {
  await login(page, 'ana', '/account/wallets');
  const primary = page.getByRole('region', { name: 'Carteira principal', exact: true });
  await primary.getByLabel('Endereço da carteira', { exact: true }).fill('inválido');
  await primary.getByRole('button', { name: 'Salvar carteira', exact: true }).click();
  await expect(primary.getByText('Endereço inválido para a rede selecionada')).toBeVisible();
  const address = '0x9876543210abcdef1234567890abcdef12345678';
  await primary.getByLabel('Endereço da carteira', { exact: true }).fill(address);
  await primary.getByLabel('Apelido da carteira', { exact: true }).fill('Carteira de coleção');
  await primary.getByRole('button', { name: 'Salvar carteira', exact: true }).click();
  await expect(primary.getByRole('status')).toContainText('Carteira salva');
  await page.getByLabel('Igual à carteira principal', { exact: true }).check();
  const secondary = page.getByRole('region', { name: 'Carteira secundária', exact: true });
  await expect(secondary.getByTestId('wallet-address')).toHaveText(address);
  await primary.getByLabel('Apelido da carteira', { exact: true }).fill('Novo apelido');
  await primary.getByRole('button', { name: 'Salvar carteira', exact: true }).click();
  await expect(secondary).toContainText('Novo apelido');
  await page.reload();
  await expect(primary.getByLabel('Endereço da carteira', { exact: true })).toHaveValue(address);
  await expect(page.getByLabel('Igual à carteira principal', { exact: true })).toBeChecked();
});

test('perfil e carteiras respeitam viewport e navegação da conta', async ({
  page,
  isMobile,
}, testInfo) => {
  await login(page);
  await expect(page.getByRole('navigation', { name: 'Menu da conta', exact: true })).toBeVisible();
  await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue('Ana Costa');
  if (isMobile) {
    const bounds = await page.getByLabel('Nome de exibição', { exact: true }).boundingBox();
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: testInfo.outputPath('profile.png'), fullPage: true });
  await page
    .getByRole('navigation', { name: 'Menu da conta' })
    .getByRole('link', { name: 'Carteiras', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Carteira principal', exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Endereço da carteira', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('wallets.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('alterações de carteira na fila não atingem o próximo usuário após logout', async ({
  page,
}) => {
  await login(page, 'ana', '/account/wallets');
  const primary = page.getByRole('region', { name: 'Carteira principal', exact: true });
  await primary.getByLabel('Apelido da carteira', { exact: true }).fill('Alteração pendente');
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 1500, jitterMs: 0 });
  });
  const pending = page.waitForResponse(
    (response) =>
      response.request().method() === 'PUT' && response.url().endsWith('/api/wallets/primary'),
  );
  await primary.getByRole('button', { name: 'Salvar carteira', exact: true }).click();
  let secondaryWrites = 0;
  page.on('request', (request) => {
    if (request.method() === 'PUT' && request.url().endsWith('/api/wallets/secondary'))
      secondaryWrites++;
  });
  await page.getByLabel('Igual à carteira principal', { exact: true }).check();
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 0, jitterMs: 0 });
  });
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await page.getByRole('menuitem', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL('/');
  await page.getByRole('link', { name: 'Meu perfil', exact: true }).click();
  await page.getByLabel('E-mail', { exact: true }).fill('bruno@kurio.test');
  await page.getByLabel('Senha', { exact: true }).fill('Kurio!2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Menu da conta' })
    .getByRole('link', { name: 'Carteiras', exact: true })
    .click();
  expect((await pending).status()).toBe(401);
  await expect(primary.getByLabel('Apelido da carteira', { exact: true })).toHaveValue('');
  expect(secondaryWrites).toBe(0);
  expect(await page.evaluate(() => window.__kurio.getState().wallets['user-bruno'])).toEqual({
    primary: null,
    secondary: null,
    sameAsPrimary: false,
  });
});
