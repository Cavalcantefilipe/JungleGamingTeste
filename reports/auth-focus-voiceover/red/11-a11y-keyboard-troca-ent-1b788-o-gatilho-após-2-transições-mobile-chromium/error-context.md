# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 11-a11y-keyboard.spec.ts >> troca entre login e cadastro devolve foco ao gatilho após 2 transições
- Location: e2e/11-a11y-keyboard.spec.ts:81:3

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  getByRole('link', { name: 'Perfil', exact: true })
Expected: focused
Received: inactive
Timeout:  8000ms

Call log:
  - Expect "toBeFocused" getByRole('link', { name: 'Perfil', exact: true }) with timeout 8000ms
  - waiting for getByRole('link', { name: 'Perfil', exact: true })
    20 × locator resolved to <a class="mobile-tab" aria-label="Perfil" href="/account/profile">…</a>
       - unexpected value "inactive"

```

```yaml
- link "Perfil":
  - /url: /account/profile
```

# Test source

```ts
  7   | 
  8   | import type { Locator, Page } from '@playwright/test';
  9   | 
  10  | async function tabUntil(page: Page, target: Locator, reverse = false) {
  11  |   const modifier =
  12  |     process.platform === 'darwin' && page.context().browser()?.browserType().name() === 'webkit'
  13  |       ? 'Alt+'
  14  |       : '';
  15  |   for (let step = 0; step < 160; step++) {
  16  |     if (await target.evaluate((element) => element === document.activeElement)) return;
  17  |     await page.keyboard.press(`${modifier}${reverse ? 'Shift+Tab' : 'Tab'}`);
  18  |   }
  19  |   await expect(target).toBeFocused();
  20  | }
  21  | async function expectContainedFocus(page: Page, dialog: Locator) {
  22  |   for (let step = 0; step < 20; step++) {
  23  |     await page.keyboard.press('Tab');
  24  |     expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  25  |   }
  26  | }
  27  | async function expectAccessible(page: Page, path: string) {
  28  |   await page.evaluate(() => document.fonts.ready);
  29  |   const result = await new AccessibilityScanner({ page })
  30  |     .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
  31  |     .analyze();
  32  |   expect(
  33  |     result.violations.filter((entry) => ['critical', 'serious'].includes(entry.impact ?? '')),
  34  |     `${path}: ${JSON.stringify(result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target }) => target) })))}`,
  35  |   ).toEqual([]);
  36  | }
  37  | async function expectNoOverflow(page: Page) {
  38  |   expect(
  39  |     await page.evaluate(
  40  |       () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  41  |     ),
  42  |   ).toBe(true);
  43  | }
  44  | 
  45  | test('teclado alcança paginação e abre detalhe sem mouse', async ({ page }) => {
  46  |   await page.goto('/');
  47  |   const second = page.getByRole('button', { name: 'Página 2', exact: true });
  48  |   await expect(second).toBeVisible();
  49  |   await tabUntil(page, second);
  50  |   const pageTwoResponse = page.waitForResponse((response) => {
  51  |     const url = new URL(response.url());
  52  |     return url.pathname === '/api/nfts' && url.searchParams.get('page') === '2';
  53  |   });
  54  |   await page.keyboard.press('Enter');
  55  |   await expect(page).toHaveURL(/page=2/);
  56  |   const first = nftListResponseSchema.parse(await (await pageTwoResponse).json()).items[0];
  57  |   if (!first) throw new Error('Segunda página sem NFTs');
  58  |   const nft = page.getByTestId('nft-grid').getByRole('link').first();
  59  |   await expect(nft).toHaveAttribute('href', `/nfts/${first.id}`);
  60  |   await tabUntil(page, nft, true);
  61  |   await page.keyboard.press('Enter');
  62  |   await expect(page.getByTestId('gallery-image')).toBeVisible();
  63  |   await expect(page).toHaveURL(/\/nfts\//);
  64  | });
  65  | 
  66  | test('diálogo de login prende foco e devolve ao controle após Esc', async ({ page, isMobile }) => {
  67  |   await page.goto('/');
  68  |   const trigger = isMobile
  69  |     ? page.getByRole('link', { name: 'Perfil', exact: true })
  70  |     : page.getByRole('banner').getByRole('link', { name: 'Entrar', exact: true });
  71  |   await trigger.click();
  72  |   const dialog = page.getByRole('dialog');
  73  |   await expect(dialog).toBeVisible();
  74  |   await expectContainedFocus(page, dialog);
  75  |   await page.keyboard.press('Escape');
  76  |   await expect(dialog).toHaveCount(0);
  77  |   await expect(trigger).toBeFocused();
  78  | });
  79  | 
  80  | for (const transitions of [1, 2]) {
  81  |   test(`troca entre login e cadastro devolve foco ao gatilho após ${transitions} transições`, async ({
  82  |     page,
  83  |     isMobile,
  84  |   }) => {
  85  |     await page.goto('/');
  86  |     const trigger = isMobile
  87  |       ? page.getByRole('link', { name: 'Perfil', exact: true })
  88  |       : page.getByRole('banner').getByRole('link', { name: 'Entrar', exact: true });
  89  |     await trigger.click();
  90  |     const dialog = page.getByRole('dialog');
  91  |     for (let transition = 0; transition < transitions; transition++) {
  92  |       const register = transition % 2 === 0;
  93  |       const name = register
  94  |         ? isMobile
  95  |           ? 'Crie uma conta'
  96  |           : 'Criar conta'
  97  |         : isMobile
  98  |           ? 'Entre'
  99  |           : 'Entrar';
  100 |       await tabUntil(page, dialog.getByRole('link', { name, exact: true }));
  101 |       await page.keyboard.press('Enter');
  102 |       await expect(page).toHaveURL(register ? /\/register/ : /\/login/);
  103 |       await expect(dialog).toBeVisible();
  104 |     }
  105 |     await page.keyboard.press('Escape');
  106 |     await expect(dialog).toHaveCount(0);
> 107 |     await expect(trigger).toBeFocused();
      |                           ^ Error: expect(locator).toBeFocused() failed
  108 |   });
  109 | }
  110 | 
  111 | test('drawer mobile prende foco e devolve ao gatilho após Esc', async ({ page, isMobile }) => {
  112 |   test.skip(!isMobile, 'Drawer do frame mobile');
  113 |   await page.goto('/');
  114 |   const trigger = page.getByRole('button', { name: 'Filtros', exact: true });
  115 |   await trigger.click();
  116 |   const dialog = page.getByRole('dialog');
  117 |   await expect(dialog).toBeVisible();
  118 |   await expectContainedFocus(page, dialog);
  119 |   await page.keyboard.press('Escape');
  120 |   await expect(dialog).toHaveCount(0);
  121 |   await expect(trigger).toBeFocused();
  122 | });
  123 | 
  124 | test('formulário anuncia erro e foca primeiro campo inválido', async ({ page }) => {
  125 |   await page.goto('/login');
  126 |   await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  127 |   const email = page.getByLabel('E-mail', { exact: true });
  128 |   await expect(email).toBeFocused();
  129 |   await expect(email).toHaveAttribute('aria-invalid', 'true');
  130 |   await expect(
  131 |     page.getByRole('alert').filter({ hasText: 'Informe um e-mail válido' }),
  132 |   ).toBeVisible();
  133 | });
  134 | 
  135 | test('rotas públicas não têm violações críticas ou sérias de acessibilidade', async ({ page }) => {
  136 |   for (const path of ['/', '/nfts/nft-001', '/cart', '/login', '/register', '/inexistente']) {
  137 |     await page.goto(path);
  138 |     if (path === '/') await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
  139 |     if (path.startsWith('/nfts/')) await expect(page.getByTestId('gallery-image')).toBeVisible();
  140 |     if (path === '/cart')
  141 |       await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible();
  142 |     if (['/login', '/register'].includes(path))
  143 |       await expect(page.getByRole('dialog')).toBeVisible();
  144 |     await expectAccessible(page, path);
  145 |     await expectNoOverflow(page);
  146 |   }
  147 | });
  148 | 
  149 | test('carrinho cheio pagamento perfil carteiras e favoritos passam axe e não transbordam', async ({
  150 |   page,
  151 |   isMobile,
  152 | }) => {
  153 |   await prepareCheckout(page, isMobile);
  154 |   await expectAccessible(page, '/checkout');
  155 |   await expectNoOverflow(page);
  156 |   for (const path of ['/cart', '/account/profile', '/account/wallets', '/?favorites=true']) {
  157 |     await page.goto(path);
  158 |     if (path === '/cart') {
  159 |       await expect(page.getByTestId('quote-total')).toBeVisible();
  160 |       await expect(page.getByRole('button', { name: 'Aplicar', exact: true })).toHaveCSS(
  161 |         'opacity',
  162 |         '1',
  163 |       );
  164 |     }
  165 |     if (path === '/account/profile')
  166 |       await expect(page.getByLabel('Nome de exibição', { exact: true })).toBeVisible();
  167 |     if (path === '/account/wallets')
  168 |       await expect(
  169 |         page.getByRole('button', { name: 'Salvar carteira', exact: true }).first(),
  170 |       ).toBeVisible();
  171 |     if (path.includes('favorites'))
  172 |       await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(3);
  173 |     await expectAccessible(page, path);
  174 |     await expectNoOverflow(page);
  175 |   }
  176 | });
  177 | 
  178 | test('largura equivalente ao zoom 200% mantém todas as telas utilizáveis', async ({
  179 |   page,
  180 |   isMobile,
  181 | }) => {
  182 |   test.skip(isMobile, 'Zoom desktop representado por 720 CSS pixels');
  183 |   await page.setViewportSize({ width: 720, height: 900 });
  184 |   await login(page);
  185 |   for (const path of [
  186 |     '/',
  187 |     '/nfts/nft-001',
  188 |     '/cart',
  189 |     '/account/profile',
  190 |     '/account/wallets',
  191 |     '/login',
  192 |     '/register',
  193 |   ]) {
  194 |     await page.goto(path);
  195 |     await expect(page.getByRole('main')).toBeAttached();
  196 |     await expectNoOverflow(page);
  197 |   }
  198 |   await addNft(page, true);
  199 |   await page.getByRole('link', { name: 'Conectar e finalizar', exact: true }).click();
  200 |   await expect(page.getByRole('button', { name: 'Revisar cotação', exact: true })).toBeVisible();
  201 |   await expectNoOverflow(page);
  202 | });
  203 | 
  204 | test('Mercado fica ativo no menu desktop do detalhe carrinho e pagamento', async ({
  205 |   page,
  206 |   isMobile,
  207 | }) => {
```