# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 32-catalog-announcement.spec.ts >> abrir e recarregar catálogo com filtros não anuncia contagem inicial
- Location: e2e/32-catalog-announcement.spec.ts:6:1

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
      - searchbox "Buscar NFTs" [ref=e7]: Cosmic
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
        - generic [ref=e35]: 5 NFTs encontrados
        - tabpanel "Todos os NFTs" [ref=e36]:
          - generic [ref=e37]:
            - article [ref=e38]:
              - 'link "Ilustração de Cosmic Bloom #118 Cosmic Bloom #118 1.29 ETH" [ref=e39] [cursor=pointer]':
                - /url: /nfts/nft-004
                - 'img "Ilustração de Cosmic Bloom #118" [ref=e42]'
                - generic [ref=e43]:
                  - 'heading "Cosmic Bloom #118" [level=3] [ref=e44]'
                  - generic [ref=e45]: 1.29 ETH
              - 'button "Favoritar Cosmic Bloom #118" [ref=e47]'
            - article [ref=e48]:
              - 'link "Ilustração de Cosmic Bloom #112 Cosmic Bloom #112 1.69 ETH" [ref=e49] [cursor=pointer]':
                - /url: /nfts/nft-013
                - 'img "Ilustração de Cosmic Bloom #112" [ref=e52]'
                - generic [ref=e53]:
                  - 'heading "Cosmic Bloom #112" [level=3] [ref=e54]'
                  - generic [ref=e55]: 1.69 ETH
              - 'button "Favoritar Cosmic Bloom #112" [ref=e57]'
            - article [ref=e58]:
              - 'link "Ilustração de Cosmic Bloom #121 Cosmic Bloom #121 12.30 ETH" [ref=e59] [cursor=pointer]':
                - /url: /nfts/nft-022
                - 'img "Ilustração de Cosmic Bloom #121" [ref=e62]'
                - generic [ref=e63]:
                  - 'heading "Cosmic Bloom #121" [level=3] [ref=e64]'
                  - generic [ref=e65]: 12.30 ETH
              - 'button "Favoritar Cosmic Bloom #121" [ref=e67]'
            - article [ref=e68]:
              - 'link "Ilustração de Cosmic Bloom #130 Cosmic Bloom #130 0.39 ETH" [ref=e69] [cursor=pointer]':
                - /url: /nfts/nft-031
                - 'img "Ilustração de Cosmic Bloom #130" [ref=e72]'
                - generic [ref=e73]:
                  - 'heading "Cosmic Bloom #130" [level=3] [ref=e74]'
                  - generic [ref=e75]: 0.39 ETH
              - 'button "Favoritar Cosmic Bloom #130" [ref=e77]'
            - article [ref=e78]:
              - 'link "Ilustração de Cosmic Bloom #139 Cosmic Bloom #139 0.99 ETH" [ref=e79] [cursor=pointer]':
                - /url: /nfts/nft-040
                - 'img "Ilustração de Cosmic Bloom #139" [ref=e82]'
                - generic [ref=e83]:
                  - 'heading "Cosmic Bloom #139" [level=3] [ref=e84]'
                  - generic [ref=e85]: 0.99 ETH
              - 'button "Favoritar Cosmic Bloom #139" [ref=e87]'
    - region "Explore as coleções" [ref=e88]:
      - article [ref=e89]:
        - img "Arte da coleção Kurio Apes" [ref=e91]
        - generic [ref=e92]:
          - heading "Lançamentos gênesis de edição limitada" [level=2] [ref=e93]
          - paragraph [ref=e94]: Colecione edições escassas diretamente dos criadores antes da revelação pública.
          - link "Explorar" [ref=e95] [cursor=pointer]:
            - /url: "#catalogo"
      - article [ref=e96]:
        - img "Arte da coleção Kurio Apes" [ref=e98]
        - generic [ref=e99]:
          - heading "Arte digital selecionada e muito mais" [level=2] [ref=e100]
          - paragraph [ref=e101]: Explore novos artistas, coleções verificadas e obras digitais que definem a cena.
          - link "Explorar" [ref=e102] [cursor=pointer]:
            - /url: "#catalogo"
    - generic [ref=e103]:
      - generic [ref=e104]:
        - heading "Diário da Cunhagem" [level=2] [ref=e105]
        - paragraph [ref=e106]: Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      - generic [ref=e107]:
        - article [ref=e108]:
          - img "Arte da coleção Kurio Apes" [ref=e110]
          - generic [ref=e111]:
            - paragraph [ref=e112]: 12 de setembro | Leitura de 6 min
            - heading "Como funciona a propriedade de NFTs" [level=3] [ref=e113]
            - paragraph [ref=e114]: Aprenda a colecionar, negociar e verificar ativos digitais.
            - button "Ler mais" [ref=e115] [cursor=pointer]
        - article [ref=e118]:
          - img "Arte da coleção Kurio Apes" [ref=e120]
          - generic [ref=e121]:
            - paragraph [ref=e122]: 13 de setembro | Leitura de 2 min
            - heading "10 artistas digitais para acompanhar" [level=3] [ref=e123]
            - paragraph [ref=e124]: Conheça criadores que moldam a cultura digital.
            - button "Ler mais" [ref=e125] [cursor=pointer]
        - article [ref=e128]:
          - img "Arte da coleção Kurio Apes" [ref=e130]
          - generic [ref=e131]:
            - paragraph [ref=e132]: 15 de setembro | Leitura de 3 min
            - heading "Raridade, atributos e procedência" [level=3] [ref=e133]
            - paragraph [ref=e134]: Entenda raridade, procedência, direitos autorais e utilidade.
            - button "Ler mais" [ref=e135] [cursor=pointer]
        - article [ref=e138]:
          - img "Arte da coleção Kurio Apes" [ref=e140]
          - generic [ref=e141]:
            - paragraph [ref=e142]: 15 de setembro | Leitura de 2 min
            - heading "Como proteger sua carteira" [level=3] [ref=e143]
            - paragraph [ref=e144]: Proteja sua carteira, seus ativos e sua identidade.
            - button "Ler mais" [ref=e145] [cursor=pointer]
  - contentinfo [ref=e150]:
    - generic [ref=e151]:
      - generic [ref=e152]:
        - generic [aria-hidden] [ref=e153]: W
        - heading "Segurança da carteira" [level=2] [ref=e154]
        - paragraph [ref=e155]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e156]:
        - generic [aria-hidden] [ref=e157]: C
        - heading "Criadores em destaque" [level=2] [ref=e158]
        - paragraph [ref=e159]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e160]:
        - generic [aria-hidden] [ref=e161]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e162]
        - paragraph [ref=e163]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e164]:
        - generic [ref=e165]: Antecipe-se ao próximo lançamento
        - generic [ref=e166]:
          - textbox "E-mail para newsletter" [ref=e167]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e168]
        - paragraph [ref=e169]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e170]:
      - strong [ref=e171]: KURIO
      - paragraph [ref=e172]: Feito para colecionadores,criadores e cultura
      - generic [ref=e173]: contato@email.com
      - generic [ref=e174]: +55 11 4002 8922
    - generic [ref=e175]:
      - generic [ref=e176]:
        - heading "Meu perfil" [level=2] [ref=e177]
        - link "Meu perfil" [ref=e178] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e179] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e180] [cursor=pointer]
        - button "Atividade" [ref=e181] [cursor=pointer]
        - link "Lista de interesse" [ref=e182] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e183]:
        - heading "Central de ajuda" [level=2] [ref=e184]
        - button "Central de ajuda" [ref=e185] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e186] [cursor=pointer]
        - button "Carteira e segurança" [ref=e187] [cursor=pointer]
        - button "Política do mercado" [ref=e188] [cursor=pointer]
        - button "Denunciar item" [ref=e189] [cursor=pointer]
      - generic [ref=e190]:
        - heading "Coleções" [level=2] [ref=e191]
        - link "Arte digital" [ref=e192] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e193] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e194] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e195] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e196] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e197]:
        - generic [ref=e198]:
          - heading "Redes sociais" [level=2] [ref=e199]
          - generic [ref=e200]:
            - button "Facebook" [ref=e201]
            - button "Instagram" [ref=e202]
            - button "Twitter" [ref=e203]
            - button "LinkedIn" [ref=e204]
            - button "YouTube" [ref=e205]
        - generic [ref=e206]:
          - heading "Carteiras compatíveis" [level=2] [ref=e207]
          - paragraph [ref=e208]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e209]: © 2026 Kurio. Propriedade digital para todos.
  - navigation "Navegação mobile" [ref=e210]:
    - link "Início" [ref=e211] [cursor=pointer]:
      - /url: /
    - link "Favoritos" [ref=e214] [cursor=pointer]:
      - /url: /login?returnTo=%2F%3Ffavorites%3Dtrue
    - link "Explorar mercado" [ref=e217] [cursor=pointer]:
      - /url: /#catalogo
    - link "Abrir carrinho, 0 itens" [ref=e220] [cursor=pointer]:
      - /url: /cart
    - link "Perfil" [ref=e223] [cursor=pointer]:
      - /url: /account/profile
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { expect, test } from './fixtures/kurio';
  2  | 
  3  | const resultAnnouncement = (page: import('@playwright/test').Page) =>
  4  |   page.locator('[aria-live="polite"]').filter({ hasText: /NFTs? encontrad/ });
  5  | 
  6  | test('abrir e recarregar catálogo com filtros não anuncia contagem inicial', async ({ page }) => {
  7  |   await page.goto('/?q=Cosmic&scenario=slow-network');
  8  |   await expect(page.getByLabel('Carregando NFT').first()).toBeVisible();
> 9  |   await expect(resultAnnouncement(page)).toHaveCount(0);
     |                                          ^ Error: expect(locator).toHaveCount(expected) failed
  10 |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Cosmic');
  11 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  12 |   await page.reload();
  13 |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Cosmic');
  14 |   await expect(resultAnnouncement(page)).toHaveCount(0);
  15 | });
  16 | 
  17 | test('busca e retorno aos filtros iniciais anunciam resultados sem duplicar a contagem', async ({
  18 |   page,
  19 |   isMobile,
  20 | }) => {
  21 |   await page.goto('/');
  22 |   await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  23 |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  24 |   await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Cosmic Bloom');
  25 |   await expect(resultAnnouncement(page)).toHaveText('1 NFT encontrado');
  26 |   await expect(page.getByText('1 NFT encontrado', { exact: true })).toHaveCount(1);
  27 |   await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('');
  28 |   await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
  29 |   await page.getByRole('button', { name: 'Página 2', exact: true }).click();
  30 |   await expect(page).toHaveURL(/page=2/);
  31 |   await expect(resultAnnouncement(page)).toHaveText('48 NFTs encontrados');
  32 | });
  33 | 
  34 | test('filtro acionado pelo rodapé também anuncia o resultado', async ({ page }) => {
  35 |   await page.goto('/');
  36 |   await expect(page.getByTestId('nft-grid')).toBeVisible();
  37 |   await page.getByRole('contentinfo').getByRole('link', { name: 'Arte digital', exact: true }).click();
  38 |   await expect(page).toHaveURL(/category=arte-digital/);
  39 |   await expect(resultAnnouncement(page)).toContainText('NFTs encontrados');
  40 | });
  41 | 
```