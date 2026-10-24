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
          - /url: /login?returnTo=%2F%3Fq%3DCosmic%26scenario%3Dslow-network
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
          - generic [ref=e108]:
            - searchbox "Buscar NFTs" [ref=e109]: Cosmic
            - generic [ref=e110]:
              - tablist "Catálogo" [ref=e111]:
                - tab "Todos os NFTs" [selected] [ref=e112] [cursor=pointer]
                - tab "Novos lançamentos" [ref=e113] [cursor=pointer]
                - tab "Em alta" [ref=e114] [cursor=pointer]
              - generic [ref=e116]:
                - text: Ordenar por
                - combobox "Ordenar por" [ref=e117]:
                  - option "Listados recentemente" [selected]
                  - option "Menor preço"
                  - option "Maior preço"
                  - option "Melhor avaliação"
          - generic [ref=e118]: 5 NFTs encontrados
          - tabpanel "Todos os NFTs" [ref=e119]:
            - generic [ref=e120]:
              - article [ref=e121]:
                - 'link "Ilustração de Cosmic Bloom #118 Cosmic Bloom #118 1.29 ETH" [ref=e122] [cursor=pointer]':
                  - /url: /nfts/nft-004
                  - 'img "Ilustração de Cosmic Bloom #118" [ref=e125]'
                  - generic [ref=e126]:
                    - 'heading "Cosmic Bloom #118" [level=3] [ref=e127]'
                    - generic [ref=e128]: 1.29 ETH
                - 'button "Favoritar Cosmic Bloom #118" [ref=e130]'
              - article [ref=e131]:
                - 'link "Ilustração de Cosmic Bloom #112 Cosmic Bloom #112 1.69 ETH" [ref=e132] [cursor=pointer]':
                  - /url: /nfts/nft-013
                  - 'img "Ilustração de Cosmic Bloom #112" [ref=e135]'
                  - generic [ref=e136]:
                    - 'heading "Cosmic Bloom #112" [level=3] [ref=e137]'
                    - generic [ref=e138]: 1.69 ETH
                - 'button "Favoritar Cosmic Bloom #112" [ref=e140]'
              - article [ref=e141]:
                - 'link "Ilustração de Cosmic Bloom #121 Cosmic Bloom #121 12.30 ETH" [ref=e142] [cursor=pointer]':
                  - /url: /nfts/nft-022
                  - 'img "Ilustração de Cosmic Bloom #121" [ref=e145]'
                  - generic [ref=e146]:
                    - 'heading "Cosmic Bloom #121" [level=3] [ref=e147]'
                    - generic [ref=e148]: 12.30 ETH
                - 'button "Favoritar Cosmic Bloom #121" [ref=e150]'
              - article [ref=e151]:
                - 'link "Ilustração de Cosmic Bloom #130 Cosmic Bloom #130 0.39 ETH" [ref=e152] [cursor=pointer]':
                  - /url: /nfts/nft-031
                  - 'img "Ilustração de Cosmic Bloom #130" [ref=e155]'
                  - generic [ref=e156]:
                    - 'heading "Cosmic Bloom #130" [level=3] [ref=e157]'
                    - generic [ref=e158]: 0.39 ETH
                - 'button "Favoritar Cosmic Bloom #130" [ref=e160]'
              - article [ref=e161]:
                - 'link "Ilustração de Cosmic Bloom #139 Cosmic Bloom #139 0.99 ETH" [ref=e162] [cursor=pointer]':
                  - /url: /nfts/nft-040
                  - 'img "Ilustração de Cosmic Bloom #139" [ref=e165]'
                  - generic [ref=e166]:
                    - 'heading "Cosmic Bloom #139" [level=3] [ref=e167]'
                    - generic [ref=e168]: 0.99 ETH
                - 'button "Favoritar Cosmic Bloom #139" [ref=e170]'
    - region "Explore as coleções" [ref=e171]:
      - article [ref=e172]:
        - img "Arte da coleção Kurio Apes" [ref=e174]
        - generic [ref=e175]:
          - heading "Lançamentos gênesis de edição limitada" [level=2] [ref=e176]
          - paragraph [ref=e177]: Colecione edições escassas diretamente dos criadores antes da revelação pública.
          - link "Explorar" [ref=e178] [cursor=pointer]:
            - /url: "#catalogo"
      - article [ref=e179]:
        - img "Arte da coleção Kurio Apes" [ref=e181]
        - generic [ref=e182]:
          - heading "Arte digital selecionada e muito mais" [level=2] [ref=e183]
          - paragraph [ref=e184]: Explore novos artistas, coleções verificadas e obras digitais que definem a cena.
          - link "Explorar" [ref=e185] [cursor=pointer]:
            - /url: "#catalogo"
    - generic [ref=e186]:
      - generic [ref=e187]:
        - heading "Diário da Cunhagem" [level=2] [ref=e188]
        - paragraph [ref=e189]: Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      - generic [ref=e190]:
        - article [ref=e191]:
          - img "Arte da coleção Kurio Apes" [ref=e193]
          - generic [ref=e194]:
            - paragraph [ref=e195]: 12 de setembro | Leitura de 6 min
            - heading "Como funciona a propriedade de NFTs" [level=3] [ref=e196]
            - paragraph [ref=e197]: Aprenda a colecionar, negociar e verificar ativos digitais.
            - button "Ler mais" [ref=e198] [cursor=pointer]
        - article [ref=e201]:
          - img "Arte da coleção Kurio Apes" [ref=e203]
          - generic [ref=e204]:
            - paragraph [ref=e205]: 13 de setembro | Leitura de 2 min
            - heading "10 artistas digitais para acompanhar" [level=3] [ref=e206]
            - paragraph [ref=e207]: Conheça criadores que moldam a cultura digital.
            - button "Ler mais" [ref=e208] [cursor=pointer]
        - article [ref=e211]:
          - img "Arte da coleção Kurio Apes" [ref=e213]
          - generic [ref=e214]:
            - paragraph [ref=e215]: 15 de setembro | Leitura de 3 min
            - heading "Raridade, atributos e procedência" [level=3] [ref=e216]
            - paragraph [ref=e217]: Entenda raridade, procedência, direitos autorais e utilidade.
            - button "Ler mais" [ref=e218] [cursor=pointer]
        - article [ref=e221]:
          - img "Arte da coleção Kurio Apes" [ref=e223]
          - generic [ref=e224]:
            - paragraph [ref=e225]: 15 de setembro | Leitura de 2 min
            - heading "Como proteger sua carteira" [level=3] [ref=e226]
            - paragraph [ref=e227]: Proteja sua carteira, seus ativos e sua identidade.
            - button "Ler mais" [ref=e228] [cursor=pointer]
  - contentinfo [ref=e233]:
    - generic [ref=e234]:
      - generic [ref=e235]:
        - generic [aria-hidden] [ref=e236]: W
        - heading "Segurança da carteira" [level=2] [ref=e237]
        - paragraph [ref=e238]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e239]:
        - generic [aria-hidden] [ref=e240]: C
        - heading "Criadores em destaque" [level=2] [ref=e241]
        - paragraph [ref=e242]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e243]:
        - generic [aria-hidden] [ref=e244]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e245]
        - paragraph [ref=e246]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e247]:
        - generic [ref=e248]: Antecipe-se ao próximo lançamento
        - generic [ref=e249]:
          - textbox "E-mail para newsletter" [ref=e250]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e251]
        - paragraph [ref=e252]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e253]:
      - strong [ref=e254]: KURIO
      - paragraph [ref=e255]: Feito para colecionadores,criadores e cultura
      - generic [ref=e256]: contato@email.com
      - generic [ref=e257]: +55 11 4002 8922
    - generic [ref=e258]:
      - generic [ref=e259]:
        - heading "Meu perfil" [level=2] [ref=e260]
        - link "Meu perfil" [ref=e261] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e262] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e263] [cursor=pointer]
        - button "Atividade" [ref=e264] [cursor=pointer]
        - link "Lista de interesse" [ref=e265] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e266]:
        - heading "Central de ajuda" [level=2] [ref=e267]
        - button "Central de ajuda" [ref=e268] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e269] [cursor=pointer]
        - button "Carteira e segurança" [ref=e270] [cursor=pointer]
        - button "Política do mercado" [ref=e271] [cursor=pointer]
        - button "Denunciar item" [ref=e272] [cursor=pointer]
      - generic [ref=e273]:
        - heading "Coleções" [level=2] [ref=e274]
        - link "Arte digital" [ref=e275] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e276] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e277] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e278] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e279] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e280]:
        - generic [ref=e281]:
          - heading "Redes sociais" [level=2] [ref=e282]
          - generic [ref=e283]:
            - button "Facebook" [ref=e284]
            - button "Instagram" [ref=e285]
            - button "Twitter" [ref=e286]
            - button "LinkedIn" [ref=e287]
            - button "YouTube" [ref=e288]
        - generic [ref=e289]:
          - heading "Carteiras compatíveis" [level=2] [ref=e290]
          - paragraph [ref=e291]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e292]: © 2026 Kurio. Propriedade digital para todos.
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