import { expect, login, test } from './fixtures/kurio';

test('autenticação adapta os espaços para manter todas as ações na tela', async ({
  page,
  isMobile,
}) => {
  const viewports = isMobile
    ? [
        { width: 414, height: 896 },
        { width: 390, height: 844 },
        { width: 320, height: 844 },
        { width: 360, height: 740 },
      ]
    : [
        { width: 1366, height: 768 },
        { width: 1280, height: 600 },
        { width: 768, height: 600 },
      ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const route of ['/login', '/register']) {
      await page.goto(route);
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      const overflow = await dialog.evaluate((element) => {
        const overlay = element.parentElement;
        return overlay ? overlay.scrollHeight - overlay.clientHeight : Infinity;
      });
      expect(overflow, `${route} em ${viewport.width}×${viewport.height}`).toBeLessThanOrEqual(1);
      for (const provider of ['Google', 'Facebook']) {
        const button = dialog.getByRole('button', { name: `Continuar com ${provider}` });
        await expect(button).toBeInViewport({ ratio: 1 });
        expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(isMobile ? 44 : 40);
      }
      const finalLink = dialog.getByRole('link', {
        name: route === '/login' ? 'Crie uma conta' : 'Entre',
        exact: true,
      });
      if (isMobile) await expect(finalLink).toBeInViewport({ ratio: 1 });
    }
  }
});

test('erros de autenticação continuam acessíveis em uma tela baixa', async ({ page, isMobile }) => {
  await page.setViewportSize({ width: isMobile ? 320 : 768, height: 450 });
  for (const route of ['/login', '/register']) {
    await page.goto(route);
    const dialog = page.getByRole('dialog');
    await dialog
      .getByRole('button', {
        name: route === '/login' ? 'Entrar' : isMobile ? 'Criar perfil' : 'Criar conta',
        exact: true,
      })
      .click();
    await expect(dialog.getByRole('alert').first()).toBeVisible();
    await expect(dialog.locator('input').first()).toBeFocused();
    const facebook = dialog.getByRole('button', { name: 'Continuar com Facebook' });
    await facebook.scrollIntoViewIfNeeded();
    await expect(facebook).toBeInViewport({ ratio: 1 });
    expect(await dialog.evaluate((element) => element.scrollHeight - element.clientHeight)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('perfil não confirma alterações que ainda não foram salvas', async ({ page }) => {
  await login(page);
  const name = page.getByLabel('Nome de exibição', { exact: true });
  await name.fill('Ana Colecionadora');
  await page.getByRole('button', { name: 'Salvar perfil', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Perfil atualizado');
  await name.fill('Ainda não salvo');
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.reload();
  await expect(name).toHaveValue('Ana Colecionadora');
});

test('remover avatar não impede a confirmação de dados do perfil salvos depois', async ({
  page,
}) => {
  await login(page);
  await page
    .getByLabel('Alterar avatar', { exact: true })
    .setInputFiles('public/images/nfts/emerald-400.webp');
  await expect(page.getByAltText('Avatar do colecionador')).toBeVisible();
  await page.reload();
  await expect(page.getByAltText('Avatar do colecionador')).toBeVisible();
  await page.getByRole('button', { name: 'Remover avatar', exact: true }).click();
  await expect(page.getByAltText('Avatar do colecionador')).toHaveCount(0);
  const name = page.getByLabel('Nome de exibição', { exact: true });
  await name.fill('Ana sem avatar');
  await page.getByRole('button', { name: 'Salvar perfil', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Perfil atualizado');
  await page.reload();
  await expect(name).toHaveValue('Ana sem avatar');
  await expect(page.getByAltText('Avatar do colecionador')).toHaveCount(0);
});

test('carteiras não misturam confirmação anterior com alterações inválidas', async ({ page }) => {
  await login(page, 'ana', '/account/wallets');
  const primary = page.getByRole('region', { name: 'Carteira principal', exact: true });
  await primary.getByLabel('Apelido da carteira', { exact: true }).fill('Coleção principal');
  await primary.getByRole('button', { name: 'Salvar carteira', exact: true }).click();
  await expect(primary.getByRole('status')).toContainText('Carteira salva');
  await primary.getByLabel('Endereço da carteira', { exact: true }).fill('inválido');
  await primary.getByRole('button', { name: 'Salvar carteira', exact: true }).click();
  await expect(primary.getByRole('alert')).toContainText('Endereço inválido');
  await expect(primary.getByRole('status')).toHaveCount(0);
  await page.reload();
  await expect(primary.getByLabel('Apelido da carteira', { exact: true })).toHaveValue(
    'Coleção principal',
  );
});

test('nova edição de senha remove a confirmação da operação anterior', async ({ page }) => {
  await login(page);
  await page.getByLabel('Senha atual', { exact: true }).fill('Kurio!2026');
  await page.getByLabel('Nova senha', { exact: true }).fill('NovaSenha!2026');
  await page.getByLabel('Confirmar nova senha', { exact: true }).fill('NovaSenha!2026');
  await page.getByRole('button', { name: 'Alterar senha', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Senha alterada');
  await page.getByLabel('Senha atual', { exact: true }).fill('NovaSenha!2026');
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('fechar autenticação preserva o contexto público e evita voltar para rotas protegidas', async ({
  page,
}) => {
  for (const [returnTo, expected] of [
    ['/nfts/nft-004?tab=reviews&reviewPage=2', '/nfts/nft-004?tab=reviews&reviewPage=2'],
    ['/?q=Emerald&sort=price_asc', '/?q=Emerald&sort=price_asc'],
    ['/checkout', '/cart'],
    ['/?q=Emerald&favorites=true', '/?q=Emerald'],
    ['/account/profile', '/'],
  ]) {
    await page.goto(`/login?returnTo=${encodeURIComponent(returnTo ?? '/')}`);
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).toHaveURL(expected ?? '/');
  }
});
