# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 32-catalog-announcement.spec.ts >> normalização automática de página inicial não anuncia a contagem
- Location: e2e/32-catalog-announcement.spec.ts:51:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[aria-live="polite"]').filter({ hasText: /NFTs? encontrad/ })
Expected: 0
Received: 1
Timeout:  8000ms

Call log:
  - Expect "toHaveCount" locator('[aria-live="polite"]').filter({ hasText: /NFTs? encontrad/ }) with timeout 8000ms
  - waiting for locator('[aria-live="polite"]').filter({ hasText: /NFTs? encontrad/ })
    20 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Pular para o conteúdo" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - main [ref=e4]:
    - generic [ref=e5]:
      - searchbox "Buscar NFTs" [ref=e7]
      - button "Filtros" [ref=e8]
    - generic [ref=e10]:
      - generic:
        - paragraph: Bem-vindo à Kurio
        - heading "SEJA DONO DA CULTURA DIGITAL" [level=1]
        - paragraph: Descubra NFTs selecionados de criadores do mundo todo.
        - link "EXPLORAR" [ref=e11] [cursor=pointer]:
          - /url: "#catalogo"
      - 'img "Ilustração de Emerald Ape #042" [ref=e16]'
      - generic [ref=e18]:
        - button "Mostrar destaque 1" [pressed] [ref=e19] [cursor=pointer]
        - button "Mostrar destaque 2" [ref=e21] [cursor=pointer]
        - button "Mostrar destaque 3" [ref=e23] [cursor=pointer]
    - generic [ref=e25]:
      - heading "Catálogo de NFTs" [level=2] [ref=e26]
      - generic [ref=e28]:
        - tablist "Catálogo" [ref=e31]:
          - tab "Todos os NFTs" [selected] [ref=e32] [cursor=pointer]
          - tab "Novos lançamentos" [ref=e33] [cursor=pointer]
          - tab "Em alta" [ref=e34] [cursor=pointer]
        - generic [ref=e35]: 48 NFTs encontrados
        - tabpanel "Todos os NFTs" [ref=e36]:
          - generic [ref=e37]:
            - article [ref=e38]:
              - 'link "Ilustração de Emerald Ape #145 Emerald Ape #145 1.69 ETH" [ref=e39] [cursor=pointer]':
                - /url: /nfts/nft-046
                - 'img "Ilustração de Emerald Ape #145" [ref=e42]'
                - generic [ref=e43]:
                  - 'heading "Emerald Ape #145" [level=3] [ref=e44]'
                  - generic [ref=e45]: 1.69 ETH
              - 'button "Favoritar Emerald Ape #145" [ref=e47]'
            - article [ref=e48]:
              - 'link "Ilustração de Sage Nomad #146 Sage Nomad #146 1.99 ETH" [ref=e49] [cursor=pointer]':
                - /url: /nfts/nft-047
                - 'img "Ilustração de Sage Nomad #146" [ref=e52]'
                - generic [ref=e53]:
                  - 'heading "Sage Nomad #146" [level=3] [ref=e54]'
                  - generic [ref=e55]: 1.99 ETH
              - 'button "Favoritar Sage Nomad #146" [ref=e57]'
            - article [ref=e58]:
              - 'link "Ilustração de Neon Vessel #147 RARO Neon Vessel #147 1.29 ETH 2.29 ETH" [ref=e59] [cursor=pointer]':
                - /url: /nfts/nft-048
                - generic [ref=e60]:
                  - 'img "Ilustração de Neon Vessel #147" [ref=e62]'
                  - generic [ref=e63]: RARO
                - generic [ref=e64]:
                  - 'heading "Neon Vessel #147" [level=3] [ref=e65]'
                  - generic [ref=e66]:
                    - generic [ref=e67]: 1.29 ETH
                    - generic [ref=e68]: 2.29 ETH
              - 'button "Favoritar Neon Vessel #147" [ref=e69]'
        - navigation "Paginação do catálogo" [ref=e70]:
          - button "Página anterior" [ref=e71]
          - button "Página 1" [ref=e72]: "1"
          - button "Página 2" [ref=e73]: "2"
          - button "Página 3" [ref=e74]: "3"
          - button "Página 4" [ref=e75]: "4"
          - button "Página 5" [ref=e76]: "5"
          - button "Página 6" [ref=e77]: "6"
          - button "Próxima página" [disabled]
    - region "Explore as coleções" [ref=e78]:
      - article [ref=e79]:
        - img "Arte da coleção Kurio Apes" [ref=e81]
        - generic [ref=e82]:
          - heading "Lançamentos gênesis de edição limitada" [level=2] [ref=e83]
          - paragraph [ref=e84]: Colecione edições escassas diretamente dos criadores antes da revelação pública.
          - link "Explorar" [ref=e85] [cursor=pointer]:
            - /url: "#catalogo"
      - article [ref=e86]:
        - img "Arte da coleção Kurio Apes" [ref=e88]
        - generic [ref=e89]:
          - heading "Arte digital selecionada e muito mais" [level=2] [ref=e90]
          - paragraph [ref=e91]: Explore novos artistas, coleções verificadas e obras digitais que definem a cena.
          - link "Explorar" [ref=e92] [cursor=pointer]:
            - /url: "#catalogo"
    - generic [ref=e93]:
      - generic [ref=e94]:
        - heading "Diário da Cunhagem" [level=2] [ref=e95]
        - paragraph [ref=e96]: Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      - generic [ref=e97]:
        - article [ref=e98]:
          - img "Arte da coleção Kurio Apes" [ref=e100]
          - generic [ref=e101]:
            - paragraph [ref=e102]: 12 de setembro | Leitura de 6 min
            - heading "Como funciona a propriedade de NFTs" [level=3] [ref=e103]
            - paragraph [ref=e104]: Aprenda a colecionar, negociar e verificar ativos digitais.
            - button "Ler mais" [ref=e105] [cursor=pointer]
        - article [ref=e108]:
          - img "Arte da coleção Kurio Apes" [ref=e110]
          - generic [ref=e111]:
            - paragraph [ref=e112]: 13 de setembro | Leitura de 2 min
            - heading "10 artistas digitais para acompanhar" [level=3] [ref=e113]
            - paragraph [ref=e114]: Conheça criadores que moldam a cultura digital.
            - button "Ler mais" [ref=e115] [cursor=pointer]
        - article [ref=e118]:
          - img "Arte da coleção Kurio Apes" [ref=e120]
          - generic [ref=e121]:
            - paragraph [ref=e122]: 15 de setembro | Leitura de 3 min
            - heading "Raridade, atributos e procedência" [level=3] [ref=e123]
            - paragraph [ref=e124]: Entenda raridade, procedência, direitos autorais e utilidade.
            - button "Ler mais" [ref=e125] [cursor=pointer]
        - article [ref=e128]:
          - img "Arte da coleção Kurio Apes" [ref=e130]
          - generic [ref=e131]:
            - paragraph [ref=e132]: 15 de setembro | Leitura de 2 min
            - heading "Como proteger sua carteira" [level=3] [ref=e133]
            - paragraph [ref=e134]: Proteja sua carteira, seus ativos e sua identidade.
            - button "Ler mais" [ref=e135] [cursor=pointer]
  - contentinfo [ref=e140]:
    - generic [ref=e141]:
      - generic [ref=e142]:
        - generic [aria-hidden] [ref=e143]: W
        - heading "Segurança da carteira" [level=2] [ref=e144]
        - paragraph [ref=e145]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e146]:
        - generic [aria-hidden] [ref=e147]: C
        - heading "Criadores em destaque" [level=2] [ref=e148]
        - paragraph [ref=e149]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e150]:
        - generic [aria-hidden] [ref=e151]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e152]
        - paragraph [ref=e153]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e154]:
        - generic [ref=e155]: Antecipe-se ao próximo lançamento
        - generic [ref=e156]:
          - textbox "E-mail para newsletter" [ref=e157]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e158]
        - paragraph [ref=e159]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e160]:
      - strong [ref=e161]: KURIO
      - paragraph [ref=e162]: Feito para colecionadores,criadores e cultura
      - generic [ref=e163]: contato@email.com
      - generic [ref=e164]: +55 11 4002 8922
    - generic [ref=e165]:
      - generic [ref=e166]:
        - heading "Meu perfil" [level=2] [ref=e167]
        - link "Meu perfil" [ref=e168] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e169] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e170] [cursor=pointer]
        - button "Atividade" [ref=e171] [cursor=pointer]
        - link "Lista de interesse" [ref=e172] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e173]:
        - heading "Central de ajuda" [level=2] [ref=e174]
        - button "Central de ajuda" [ref=e175] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e176] [cursor=pointer]
        - button "Carteira e segurança" [ref=e177] [cursor=pointer]
        - button "Política do mercado" [ref=e178] [cursor=pointer]
        - button "Denunciar item" [ref=e179] [cursor=pointer]
      - generic [ref=e180]:
        - heading "Coleções" [level=2] [ref=e181]
        - link "Arte digital" [ref=e182] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e183] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e184] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e185] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e186] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e187]:
        - generic [ref=e188]:
          - heading "Redes sociais" [level=2] [ref=e189]
          - generic [ref=e190]:
            - button "Facebook" [ref=e191]
            - button "Instagram" [ref=e192]
            - button "Twitter" [ref=e193]
            - button "LinkedIn" [ref=e194]
            - button "YouTube" [ref=e195]
        - generic [ref=e196]:
          - heading "Carteiras compatíveis" [level=2] [ref=e197]
          - paragraph [ref=e198]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e199]: © 2026 Kurio. Propriedade digital para todos.
  - navigation "Navegação mobile" [ref=e200]:
    - link "Início" [ref=e201] [cursor=pointer]:
      - /url: /
    - link "Favoritos" [ref=e204] [cursor=pointer]:
      - /url: /login?returnTo=%2F%3Ffavorites%3Dtrue
    - link "Explorar mercado" [ref=e207] [cursor=pointer]:
      - /url: /#catalogo
    - link "Abrir carrinho, 0 itens" [ref=e210] [cursor=pointer]:
      - /url: /cart
    - link "Perfil" [ref=e213] [cursor=pointer]:
      - /url: /account/profile
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { expect, test } from './fixtures/kurio';
  2  | 
  3  | import type { Page } from '@playwright/test';
  4  | 
  5  | const resultAnnouncement = (page: Page) =>
  6  |   page.locator('[aria-live="polite"]').filter({ hasText: /NFTs? encontrad/ });
  7  | 
  8  | test('abrir e recarregar catálogo com filtros não anuncia contagem inicial', async ({ page }) => {
  9  |   await page.goto('/?q=Cosmic&scenario=slow-network');
  10 |   await expect(page.getByLabel('Carregando NFT').first()).toBeVisible();
  11 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  12 |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Cosmic');
  13 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  14 |   await expect(page.getByText('5 NFTs encontrados', { exact: true })).toHaveCount(1);
  15 |   await page.reload();
  16 |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Cosmic');
  17 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  18 | });
  19 | 
  20 | test('busca e retorno aos filtros iniciais anunciam resultados sem duplicar a contagem', async ({
  21 |   page,
  22 |   isMobile,
  23 | }) => {
  24 |   await page.goto('/');
  25 |   await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  26 |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  27 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  28 |   await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Cosmic Bloom');
  29 |   await expect(resultAnnouncement(page)).toHaveText('5 NFTs encontrados');
  30 |   await expect(page.getByText('5 NFTs encontrados', { exact: true })).toHaveCount(1);
  31 |   await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('');
  32 |   await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
  33 |   await page.getByRole('button', { name: 'Página 2', exact: true }).click();
  34 |   await expect(page).toHaveURL(/page=2/);
  35 |   await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
  36 |   await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('inexistente');
  37 |   await expect(resultAnnouncement(page)).toHaveText('0 NFTs encontrados');
  38 | });
  39 | 
  40 | test('filtro acionado pelo rodapé também anuncia o resultado', async ({ page }) => {
  41 |   await page.goto('/');
  42 |   await expect(page.getByTestId('nft-grid')).toBeVisible();
  43 |   await page
  44 |     .getByRole('contentinfo')
  45 |     .getByRole('link', { name: 'Arte digital', exact: true })
  46 |     .click();
  47 |   await expect(page).toHaveURL(/category=arte-digital/);
  48 |   await expect(resultAnnouncement(page)).toContainText('NFTs encontrados');
  49 | });
  50 | 
  51 | test('normalização automática de página inicial não anuncia a contagem', async ({ page }) => {
  52 |   await page.goto('/?page=999');
  53 |   await expect(page).toHaveURL(/page=6/);
  54 |   await expect(page.getByText('48 NFTs encontrados', { exact: true })).toHaveCount(1);
> 55 |   await expect(resultAnnouncement(page)).toHaveCount(0);
     |                                          ^ Error: expect(locator).toHaveCount(expected) failed
  56 |   await page.getByRole('button', { name: 'Página 5', exact: true }).click();
  57 |   await expect(page).toHaveURL(/page=5/);
  58 |   await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
  59 | });
  60 | 
  61 | test('catálogo retomado do cache mantém contagem acessível sem anúncio inicial', async ({
  62 |   page,
  63 | }) => {
  64 |   await page.goto('/');
  65 |   await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  66 |   await page.getByTestId('nft-grid').getByRole('link').first().click();
  67 |   await expect(page.getByTestId('gallery-image')).toBeVisible();
  68 |   await page.goBack();
  69 |   await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  70 |   await expect(page.getByText('48 NFTs encontrados', { exact: true })).toHaveCount(1);
  71 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  72 | });
  73 | 
  74 | test('erro inicial não informa zero resultados e mantém recuperação acessível', async ({
  75 |   page,
  76 | }) => {
  77 |   await page.goto('/?scenario=server-error-reads');
  78 |   const error = page.getByRole('tabpanel').getByRole('alert');
  79 |   await expect(error).toBeVisible();
  80 |   await expect(page.getByText('0 NFTs encontrados', { exact: true })).toHaveCount(0);
  81 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  82 |   await page.evaluate(() => {
  83 |     window.__kurio.setScenario('default');
  84 |   });
  85 |   await error.getByRole('button', { name: 'Tentar novamente' }).click();
  86 |   await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  87 |   await expect(page.getByText('48 NFTs encontrados', { exact: true })).toHaveCount(1);
  88 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  89 | });
  90 | 
```