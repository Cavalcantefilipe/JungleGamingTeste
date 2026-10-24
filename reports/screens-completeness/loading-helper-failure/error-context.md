# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 12-loading-and-recovery.spec.ts >> detalhe reserva posição e tamanho da galeria em rede lenta
- Location: e2e/12-loading-and-recovery.spec.ts:23:1

# Error details

```
Error: Elemento sem dimensões
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Pular para o conteúdo" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - main [ref=e4]:
    - status "Carregando detalhes" [ref=e5]:
      - generic [ref=e39]:
        - status [ref=e41]
        - status [ref=e47]
  - contentinfo [ref=e57]:
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [aria-hidden] [ref=e60]: W
        - heading "Segurança da carteira" [level=2] [ref=e61]
        - paragraph [ref=e62]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e63]:
        - generic [aria-hidden] [ref=e64]: C
        - heading "Criadores em destaque" [level=2] [ref=e65]
        - paragraph [ref=e66]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e67]:
        - generic [aria-hidden] [ref=e68]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e69]
        - paragraph [ref=e70]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e71]:
        - generic [ref=e72]: Antecipe-se ao próximo lançamento
        - generic [ref=e73]:
          - textbox "E-mail para newsletter" [ref=e74]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e75]
        - paragraph [ref=e76]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e77]:
      - strong [ref=e78]: KURIO
      - paragraph [ref=e79]: Feito para colecionadores,criadores e cultura
      - generic [ref=e80]: contato@email.com
      - generic [ref=e81]: +55 11 4002 8922
    - generic [ref=e82]:
      - generic [ref=e83]:
        - heading "Meu perfil" [level=2] [ref=e84]
        - link "Meu perfil" [ref=e85] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e86] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e87] [cursor=pointer]
        - button "Atividade" [ref=e88] [cursor=pointer]
        - link "Lista de interesse" [ref=e89] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e90]:
        - heading "Central de ajuda" [level=2] [ref=e91]
        - button "Central de ajuda" [ref=e92] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e93] [cursor=pointer]
        - button "Carteira e segurança" [ref=e94] [cursor=pointer]
        - button "Política do mercado" [ref=e95] [cursor=pointer]
        - button "Denunciar item" [ref=e96] [cursor=pointer]
      - generic [ref=e97]:
        - heading "Coleções" [level=2] [ref=e98]
        - link "Arte digital" [ref=e99] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e100] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e101] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e102] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e103] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e104]:
        - generic [ref=e105]:
          - heading "Redes sociais" [level=2] [ref=e106]
          - generic [ref=e107]:
            - button "Facebook" [ref=e108]
            - button "Instagram" [ref=e109]
            - button "Twitter" [ref=e110]
            - button "LinkedIn" [ref=e111]
            - button "YouTube" [ref=e112]
        - generic [ref=e113]:
          - heading "Carteiras compatíveis" [level=2] [ref=e114]
          - paragraph [ref=e115]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e116]: © 2026 Kurio. Propriedade digital para todos.
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { addNft } from './fixtures/checkout';
  2  | import { expect, login, test } from './fixtures/kurio';
  3  | 
  4  | import type { Locator } from '@playwright/test';
  5  | 
  6  | async function bounds(locator: Locator) {
  7  |   await expect(locator).toBeVisible();
  8  |   const box = await locator.boundingBox();
> 9  |   if (!box) throw new Error('Elemento sem dimensões');
     |                   ^ Error: Elemento sem dimensões
  10 |   return box;
  11 | }
  12 | 
  13 | test('catálogo reserva exatamente o espaço dos cards em rede lenta', async ({ page }) => {
  14 |   await page.goto('/?scenario=slow-network');
  15 |   const before = await bounds(page.getByLabel('Carregando NFT', { exact: true }).first());
  16 |   const card = page.getByTestId('nft-grid').locator('article').first();
  17 |   await expect(card).toBeVisible();
  18 |   const after = await bounds(card);
  19 |   for (const dimension of ['x', 'y', 'width', 'height'] as const)
  20 |     expect(Math.abs(after[dimension] - before[dimension]), dimension).toBeLessThanOrEqual(2);
  21 | });
  22 | 
  23 | test('detalhe reserva posição e tamanho da galeria em rede lenta', async ({ page }) => {
  24 |   await page.goto('/nfts/nft-001?scenario=slow-network');
  25 |   const before = await bounds(page.getByTestId('gallery-skeleton'));
  26 |   await expect(page.getByTestId('gallery-image')).toBeVisible();
  27 |   const after = await bounds(page.getByTestId('gallery-frame'));
  28 |   for (const dimension of ['x', 'y', 'width', 'height'] as const)
  29 |     expect(Math.abs(after[dimension] - before[dimension]), dimension).toBeLessThanOrEqual(2);
  30 | });
  31 | 
  32 | test('detalhe reserva as seções inferiores e não desloca um rodapé visível ao carregar', async ({
  33 |   page,
  34 |   isMobile,
  35 | }) => {
  36 |   test.skip(isMobile, 'Viewport desktop da auditoria Lighthouse');
  37 |   await page.setViewportSize({ width: 1335, height: 940 });
  38 |   await page.goto('/nfts/nft-001?scenario=slow-network');
  39 |   await expect(page.getByLabel('Carregando detalhes', { exact: true })).toBeVisible();
  40 |   const before = await bounds(page.getByRole('contentinfo'));
  41 |   expect(before.y).toBeGreaterThanOrEqual(940);
  42 |   await expect(page.getByTestId('gallery-image')).toBeVisible();
  43 |   await expect(page.getByRole('region', { name: 'Mais desta coleção', exact: true })).toBeVisible();
  44 |   const after = await bounds(page.getByRole('contentinfo'));
  45 |   expect(after.y).toBeGreaterThanOrEqual(940);
  46 | });
  47 | 
  48 | test('resumo reserva altura e posição durante cálculo lento', async ({ page, isMobile }) => {
  49 |   await addNft(page, isMobile);
  50 |   await page.evaluate(() => {
  51 |     window.__kurio.setScenario('slow-network');
  52 |   });
  53 |   await page.reload();
  54 |   const before = await bounds(page.getByLabel('Carregando resumo', { exact: true }));
  55 |   await expect(page.getByTestId('quote-total')).toBeVisible();
  56 |   const after = await bounds(page.getByTestId('quote-total').locator('..'));
  57 |   for (const dimension of ['x', 'y', 'width', 'height'] as const)
  58 |     expect(Math.abs(after[dimension] - before[dimension]), dimension).toBeLessThanOrEqual(2);
  59 | });
  60 | 
  61 | test('falha transitória mostra erro e nova tentativa recupera o catálogo', async ({ page }) => {
  62 |   await page.goto('/?scenario=server-error-reads');
  63 |   const error = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar' });
  64 |   await expect(error).toBeVisible();
  65 |   await page.evaluate(() => {
  66 |     window.__kurio.setScenario('default');
  67 |   });
  68 |   await error.getByRole('button', { name: 'Tentar novamente' }).click();
  69 |   await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
  70 |   await expect(error).toHaveCount(0);
  71 | });
  72 | 
  73 | test('reduced-motion desativa a animação dos skeletons', async ({ page }) => {
  74 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  75 |   await page.goto('/?scenario=slow-network');
  76 |   const skeleton = page.locator('[data-slot="skeleton"]').first();
  77 |   await expect(skeleton).toBeVisible();
  78 |   await expect(skeleton).toHaveCSS('animation-name', 'none');
  79 | });
  80 | 
  81 | test('validação lenta da sessão mantém feedback de rota privada', async ({ page }) => {
  82 |   await login(page);
  83 |   await page.evaluate(() => {
  84 |     window.__kurio.setScenario('slow-network');
  85 |   });
  86 |   await page.reload();
  87 |   await expect(page.getByRole('status', { name: 'Carregando página' })).toBeVisible();
  88 |   await expect(
  89 |     page.getByRole('heading', { name: 'Perfil do colecionador', exact: true }),
  90 |   ).toBeVisible();
  91 | });
  92 | 
```