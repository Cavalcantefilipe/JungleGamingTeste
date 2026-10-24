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
          - /url: "#busca"
        - link "Carrinho, 0 itens" [ref=e15] [cursor=pointer]:
          - /url: /cart
        - link "Entrar" [ref=e16] [cursor=pointer]:
          - /url: /login?returnTo=%2F%3Fpage%3D6
  - main [ref=e18]:
    - generic [ref=e19]:
      - generic:
        - paragraph: Bem-vindo à Kurio
        - heading "SEJA DONO DO FUTURO DA ARTE DIGITAL" [level=1]:
          - generic: SEJA DONO DO FUTURODA ARTE DIGITAL
        - paragraph: Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
        - link "EXPLORAR" [ref=e20] [cursor=pointer]:
          - /url: "#catalogo"
      - 'img "Ilustração de Emerald Ape #042" [ref=e23]'
      - generic [ref=e24]:
        - button "Mostrar destaque 1" [pressed] [ref=e25] [cursor=pointer]
        - button "Mostrar destaque 2" [ref=e27] [cursor=pointer]
        - button "Mostrar destaque 3" [ref=e29] [cursor=pointer]
    - generic [ref=e31]:
      - heading "Catálogo de NFTs" [level=2] [ref=e32]
      - generic [ref=e33]:
        - complementary [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]:
              - generic [ref=e37]:
                - heading "Coleções" [level=2] [ref=e38]
                - button "Limpar filtros" [ref=e39]
              - generic [ref=e40]:
                - generic [ref=e41] [cursor=pointer]:
                  - checkbox "Arte digital" [ref=e42]
                  - generic [ref=e43]: Arte digital
                  - generic [aria-hidden] [ref=e44]: (6)
                - generic [ref=e45] [cursor=pointer]:
                  - checkbox "Fotografia" [ref=e46]
                  - generic [ref=e47]: Fotografia
                  - generic [aria-hidden] [ref=e48]: (6)
                - generic [ref=e49] [cursor=pointer]:
                  - checkbox "Música" [ref=e50]
                  - generic [ref=e51]: Música
                  - generic [aria-hidden] [ref=e52]: (6)
                - generic [ref=e53] [cursor=pointer]:
                  - checkbox "Arte 3D" [ref=e54]
                  - generic [ref=e55]: Arte 3D
                  - generic [aria-hidden] [ref=e56]: (5)
                - generic [ref=e57] [cursor=pointer]:
                  - checkbox "Colecionáveis" [ref=e58]
                  - generic [ref=e59]: Colecionáveis
                  - generic [aria-hidden] [ref=e60]: (5)
                - generic [ref=e61] [cursor=pointer]:
                  - checkbox "Generativo" [ref=e62]
                  - generic [ref=e63]: Generativo
                  - generic [aria-hidden] [ref=e64]: (5)
                - generic [ref=e65] [cursor=pointer]:
                  - checkbox "Jogos" [ref=e66]
                  - generic [ref=e67]: Jogos
                  - generic [aria-hidden] [ref=e68]: (5)
                - generic [ref=e69] [cursor=pointer]:
                  - checkbox "Assinaturas" [ref=e70]
                  - generic [ref=e71]: Assinaturas
                  - generic [aria-hidden] [ref=e72]: (5)
                - generic [ref=e73] [cursor=pointer]:
                  - checkbox "Utilidade" [ref=e74]
                  - generic [ref=e75]: Utilidade
                  - generic [aria-hidden] [ref=e76]: (5)
            - generic [ref=e77]:
              - heading "Faixa de preço" [level=3] [ref=e78]
              - generic [ref=e79]:
                - slider "Preço mínimo" [ref=e83]
                - slider "Preço máximo" [ref=e85]
              - paragraph [ref=e86]: "Preço: 0,02 – 12,30 ETH"
              - button "Aplicar" [ref=e87]
            - generic [ref=e88]:
              - heading "Rede" [level=3] [ref=e89]
              - generic [ref=e90] [cursor=pointer]:
                - checkbox "Ethereum" [ref=e91]
                - generic [ref=e92]: Ethereum
                - generic [aria-hidden] [ref=e93]: (18)
              - generic [ref=e94] [cursor=pointer]:
                - checkbox "Polygon" [ref=e95]
                - generic [ref=e96]: Polygon
                - generic [aria-hidden] [ref=e97]: (15)
              - generic [ref=e98] [cursor=pointer]:
                - checkbox "Solana" [ref=e99]
                - generic [ref=e100]: Solana
                - generic [aria-hidden] [ref=e101]: (15)
          - link [ref=e102] [cursor=pointer]:
            - /url: /nfts/nft-002
            - paragraph [ref=e103]: NFT EM DESTAQUE
            - paragraph [ref=e104]: OFERTA LIMITADA
            - 'img "Ilustração de Sage Nomad #009" [ref=e106]'
        - generic [ref=e107]:
          - generic [ref=e109]:
            - tablist "Catálogo" [ref=e110]:
              - tab "Todos os NFTs" [selected] [ref=e111] [cursor=pointer]
              - tab "Novos lançamentos" [ref=e112] [cursor=pointer]
              - tab "Em alta" [ref=e113] [cursor=pointer]
            - generic [ref=e115]:
              - text: Ordenar por
              - combobox "Ordenar por" [ref=e116]:
                - option "Listados recentemente" [selected]
                - option "Menor preço"
                - option "Maior preço"
                - option "Melhor avaliação"
          - generic [ref=e117]: 48 NFTs encontrados
          - tabpanel "Todos os NFTs" [ref=e118]:
            - generic [ref=e119]:
              - article [ref=e120]:
                - 'link "Ilustração de Emerald Ape #145 Emerald Ape #145 1.69 ETH" [ref=e121] [cursor=pointer]':
                  - /url: /nfts/nft-046
                  - 'img "Ilustração de Emerald Ape #145" [ref=e124]'
                  - generic [ref=e125]:
                    - 'heading "Emerald Ape #145" [level=3] [ref=e126]'
                    - generic [ref=e127]: 1.69 ETH
                - 'button "Favoritar Emerald Ape #145" [ref=e129]'
              - article [ref=e130]:
                - 'link "Ilustração de Sage Nomad #146 Sage Nomad #146 1.99 ETH" [ref=e131] [cursor=pointer]':
                  - /url: /nfts/nft-047
                  - 'img "Ilustração de Sage Nomad #146" [ref=e134]'
                  - generic [ref=e135]:
                    - 'heading "Sage Nomad #146" [level=3] [ref=e136]'
                    - generic [ref=e137]: 1.99 ETH
                - 'button "Favoritar Sage Nomad #146" [ref=e139]'
              - article [ref=e140]:
                - 'link "Ilustração de Neon Vessel #147 RARO Neon Vessel #147 1.29 ETH 2.29 ETH" [ref=e141] [cursor=pointer]':
                  - /url: /nfts/nft-048
                  - generic [ref=e142]:
                    - 'img "Ilustração de Neon Vessel #147" [ref=e144]'
                    - generic [ref=e145]: RARO
                  - generic [ref=e146]:
                    - 'heading "Neon Vessel #147" [level=3] [ref=e147]'
                    - generic [ref=e148]:
                      - generic [ref=e149]: 1.29 ETH
                      - generic [ref=e150]: 2.29 ETH
                - 'button "Favoritar Neon Vessel #147" [ref=e151]'
          - navigation "Paginação do catálogo" [ref=e152]:
            - button "Página anterior" [ref=e153]
            - button "Página 1" [ref=e154]: "1"
            - button "Página 2" [ref=e155]: "2"
            - button "Página 3" [ref=e156]: "3"
            - button "Página 4" [ref=e157]: "4"
            - button "Página 5" [ref=e158]: "5"
            - button "Página 6" [ref=e159]: "6"
            - button "Próxima página" [disabled]
    - region "Explore as coleções" [ref=e160]:
      - article [ref=e161]:
        - img "Arte da coleção Kurio Apes" [ref=e163]
        - generic [ref=e164]:
          - heading "Lançamentos gênesis de edição limitada" [level=2] [ref=e165]
          - paragraph [ref=e166]: Colecione edições escassas diretamente dos criadores antes da revelação pública.
          - link "Explorar" [ref=e167] [cursor=pointer]:
            - /url: "#catalogo"
      - article [ref=e168]:
        - img "Arte da coleção Kurio Apes" [ref=e170]
        - generic [ref=e171]:
          - heading "Arte digital selecionada e muito mais" [level=2] [ref=e172]
          - paragraph [ref=e173]: Explore novos artistas, coleções verificadas e obras digitais que definem a cena.
          - link "Explorar" [ref=e174] [cursor=pointer]:
            - /url: "#catalogo"
    - generic [ref=e175]:
      - generic [ref=e176]:
        - heading "Diário da Cunhagem" [level=2] [ref=e177]
        - paragraph [ref=e178]: Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      - generic [ref=e179]:
        - article [ref=e180]:
          - img "Arte da coleção Kurio Apes" [ref=e182]
          - generic [ref=e183]:
            - paragraph [ref=e184]: 12 de setembro | Leitura de 6 min
            - heading "Como funciona a propriedade de NFTs" [level=3] [ref=e185]
            - paragraph [ref=e186]: Aprenda a colecionar, negociar e verificar ativos digitais.
            - button "Ler mais" [ref=e187] [cursor=pointer]
        - article [ref=e190]:
          - img "Arte da coleção Kurio Apes" [ref=e192]
          - generic [ref=e193]:
            - paragraph [ref=e194]: 13 de setembro | Leitura de 2 min
            - heading "10 artistas digitais para acompanhar" [level=3] [ref=e195]
            - paragraph [ref=e196]: Conheça criadores que moldam a cultura digital.
            - button "Ler mais" [ref=e197] [cursor=pointer]
        - article [ref=e200]:
          - img "Arte da coleção Kurio Apes" [ref=e202]
          - generic [ref=e203]:
            - paragraph [ref=e204]: 15 de setembro | Leitura de 3 min
            - heading "Raridade, atributos e procedência" [level=3] [ref=e205]
            - paragraph [ref=e206]: Entenda raridade, procedência, direitos autorais e utilidade.
            - button "Ler mais" [ref=e207] [cursor=pointer]
        - article [ref=e210]:
          - img "Arte da coleção Kurio Apes" [ref=e212]
          - generic [ref=e213]:
            - paragraph [ref=e214]: 15 de setembro | Leitura de 2 min
            - heading "Como proteger sua carteira" [level=3] [ref=e215]
            - paragraph [ref=e216]: Proteja sua carteira, seus ativos e sua identidade.
            - button "Ler mais" [ref=e217] [cursor=pointer]
  - contentinfo [ref=e222]:
    - generic [ref=e223]:
      - generic [ref=e224]:
        - generic [aria-hidden] [ref=e225]: W
        - heading "Segurança da carteira" [level=2] [ref=e226]
        - paragraph [ref=e227]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e228]:
        - generic [aria-hidden] [ref=e229]: C
        - heading "Criadores em destaque" [level=2] [ref=e230]
        - paragraph [ref=e231]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e232]:
        - generic [aria-hidden] [ref=e233]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e234]
        - paragraph [ref=e235]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e236]:
        - generic [ref=e237]: Antecipe-se ao próximo lançamento
        - generic [ref=e238]:
          - textbox "E-mail para newsletter" [ref=e239]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e240]
        - paragraph [ref=e241]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e242]:
      - strong [ref=e243]: KURIO
      - paragraph [ref=e244]: Feito para colecionadores,criadores e cultura
      - generic [ref=e245]: contato@email.com
      - generic [ref=e246]: +55 11 4002 8922
    - generic [ref=e247]:
      - generic [ref=e248]:
        - heading "Meu perfil" [level=2] [ref=e249]
        - link "Meu perfil" [ref=e250] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e251] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e252] [cursor=pointer]
        - button "Atividade" [ref=e253] [cursor=pointer]
        - link "Lista de interesse" [ref=e254] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e255]:
        - heading "Central de ajuda" [level=2] [ref=e256]
        - button "Central de ajuda" [ref=e257] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e258] [cursor=pointer]
        - button "Carteira e segurança" [ref=e259] [cursor=pointer]
        - button "Política do mercado" [ref=e260] [cursor=pointer]
        - button "Denunciar item" [ref=e261] [cursor=pointer]
      - generic [ref=e262]:
        - heading "Coleções" [level=2] [ref=e263]
        - link "Arte digital" [ref=e264] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e265] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e266] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e267] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e268] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e269]:
        - generic [ref=e270]:
          - heading "Redes sociais" [level=2] [ref=e271]
          - generic [ref=e272]:
            - button "Facebook" [ref=e273]
            - button "Instagram" [ref=e274]
            - button "Twitter" [ref=e275]
            - button "LinkedIn" [ref=e276]
            - button "YouTube" [ref=e277]
        - generic [ref=e278]:
          - heading "Carteiras compatíveis" [level=2] [ref=e279]
          - paragraph [ref=e280]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e281]: © 2026 Kurio. Propriedade digital para todos.
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