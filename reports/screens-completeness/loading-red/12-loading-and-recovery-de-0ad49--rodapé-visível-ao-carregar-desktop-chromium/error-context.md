# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 12-loading-and-recovery.spec.ts >> detalhe reserva as seções inferiores e não desloca um rodapé visível ao carregar
- Location: e2e/12-loading-and-recovery.spec.ts:32:1

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 940
Received:    721
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Pular para o conteúdo" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
    - generic [ref=e6]:
      - link "Kurio — Início" [ref=e7] [cursor=pointer]:
        - /url: /
        - text: KURIO
      - navigation "Menu principal" [ref=e8]:
        - link "Início" [ref=e9] [cursor=pointer]:
          - /url: /
        - link "Mercado" [ref=e10] [cursor=pointer]:
          - /url: /#catalogo
        - button "Criadores" [ref=e11] [cursor=pointer]
        - button "Aprenda" [ref=e12] [cursor=pointer]
      - generic [ref=e13]:
        - link "Buscar NFTs" [ref=e14] [cursor=pointer]:
          - /url: /#busca
        - link "Carrinho, 0 itens" [ref=e15] [cursor=pointer]:
          - /url: /cart
        - link "Entrar" [ref=e16] [cursor=pointer]:
          - /url: /login?returnTo=%2Fnfts%2Fnft-001%3Fscenario%3Dslow-network
  - main [ref=e18]:
    - status "Carregando detalhes" [ref=e19]
    - generic [ref=e34]: Não foi possível concluir. Tente novamente.
  - contentinfo [ref=e36]:
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [aria-hidden] [ref=e39]: W
        - heading "Segurança da carteira" [level=2] [ref=e40]
        - paragraph [ref=e41]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e42]:
        - generic [aria-hidden] [ref=e43]: C
        - heading "Criadores em destaque" [level=2] [ref=e44]
        - paragraph [ref=e45]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e46]:
        - generic [aria-hidden] [ref=e47]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e48]
        - paragraph [ref=e49]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e50]:
        - generic [ref=e51]: Antecipe-se ao próximo lançamento
        - generic [ref=e52]:
          - textbox "E-mail para newsletter" [ref=e53]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e54]
        - paragraph [ref=e55]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e56]:
      - strong [ref=e57]: KURIO
      - paragraph [ref=e58]: Feito para colecionadores,criadores e cultura
      - generic [ref=e59]: contato@email.com
      - generic [ref=e60]: +55 11 4002 8922
    - generic [ref=e61]:
      - generic [ref=e62]:
        - heading "Meu perfil" [level=2] [ref=e63]
        - link "Meu perfil" [ref=e64] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e65] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e66] [cursor=pointer]
        - button "Atividade" [ref=e67] [cursor=pointer]
        - link "Lista de interesse" [ref=e68] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e69]:
        - heading "Central de ajuda" [level=2] [ref=e70]
        - button "Central de ajuda" [ref=e71] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e72] [cursor=pointer]
        - button "Carteira e segurança" [ref=e73] [cursor=pointer]
        - button "Política do mercado" [ref=e74] [cursor=pointer]
        - button "Denunciar item" [ref=e75] [cursor=pointer]
      - generic [ref=e76]:
        - heading "Coleções" [level=2] [ref=e77]
        - link "Arte digital" [ref=e78] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e79] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e80] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e81] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e82] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e83]:
        - generic [ref=e84]:
          - heading "Redes sociais" [level=2] [ref=e85]
          - generic [ref=e86]:
            - button "Facebook" [ref=e87]
            - button "Instagram" [ref=e88]
            - button "Twitter" [ref=e89]
            - button "LinkedIn" [ref=e90]
            - button "YouTube" [ref=e91]
        - generic [ref=e92]:
          - heading "Carteiras compatíveis" [level=2] [ref=e93]
          - paragraph [ref=e94]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e95]: © 2026 Kurio. Propriedade digital para todos.
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
  9  |   if (!box) throw new Error('Elemento sem dimensões');
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
  32 | test('detalhe reserva as seções inferiores e não desloca um rodapé visível ao carregar', async ({ page, isMobile }) => {
  33 |   test.skip(isMobile, 'Viewport desktop da auditoria Lighthouse');
  34 |   await page.setViewportSize({ width: 1335, height: 940 });
  35 |   await page.goto('/nfts/nft-001?scenario=slow-network');
  36 |   await expect(page.getByLabel('Carregando detalhes', { exact: true })).toBeVisible();
  37 |   const before = await bounds(page.getByRole('contentinfo'));
> 38 |   expect(before.y).toBeGreaterThanOrEqual(940);
     |                    ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  39 |   await expect(page.getByTestId('gallery-image')).toBeVisible();
  40 |   await expect(page.getByRole('region', { name: 'Mais desta coleção', exact: true })).toBeVisible();
  41 |   const after = await bounds(page.getByRole('contentinfo'));
  42 |   expect(after.y).toBeGreaterThanOrEqual(940);
  43 | });
  44 | 
  45 | test('resumo reserva altura e posição durante cálculo lento', async ({ page, isMobile }) => {
  46 |   await addNft(page, isMobile);
  47 |   await page.evaluate(() => {
  48 |     window.__kurio.setScenario('slow-network');
  49 |   });
  50 |   await page.reload();
  51 |   const before = await bounds(page.getByLabel('Carregando resumo', { exact: true }));
  52 |   await expect(page.getByTestId('quote-total')).toBeVisible();
  53 |   const after = await bounds(page.getByTestId('quote-total').locator('..'));
  54 |   for (const dimension of ['x', 'y', 'width', 'height'] as const)
  55 |     expect(Math.abs(after[dimension] - before[dimension]), dimension).toBeLessThanOrEqual(2);
  56 | });
  57 | 
  58 | test('falha transitória mostra erro e nova tentativa recupera o catálogo', async ({ page }) => {
  59 |   await page.goto('/?scenario=server-error-reads');
  60 |   const error = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar' });
  61 |   await expect(error).toBeVisible();
  62 |   await page.evaluate(() => {
  63 |     window.__kurio.setScenario('default');
  64 |   });
  65 |   await error.getByRole('button', { name: 'Tentar novamente' }).click();
  66 |   await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
  67 |   await expect(error).toHaveCount(0);
  68 | });
  69 | 
  70 | test('reduced-motion desativa a animação dos skeletons', async ({ page }) => {
  71 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  72 |   await page.goto('/?scenario=slow-network');
  73 |   const skeleton = page.locator('[data-slot="skeleton"]').first();
  74 |   await expect(skeleton).toBeVisible();
  75 |   await expect(skeleton).toHaveCSS('animation-name', 'none');
  76 | });
  77 | 
  78 | test('validação lenta da sessão mantém feedback de rota privada', async ({ page }) => {
  79 |   await login(page);
  80 |   await page.evaluate(() => {
  81 |     window.__kurio.setScenario('slow-network');
  82 |   });
  83 |   await page.reload();
  84 |   await expect(page.getByRole('status', { name: 'Carregando página' })).toBeVisible();
  85 |   await expect(
  86 |     page.getByRole('heading', { name: 'Perfil do colecionador', exact: true }),
  87 |   ).toBeVisible();
  88 | });
  89 | 
```