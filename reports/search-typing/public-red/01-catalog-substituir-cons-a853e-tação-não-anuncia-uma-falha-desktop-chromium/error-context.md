# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-catalog.spec.ts >> substituir consultas durante a digitação não anuncia uma falha
- Location: e2e/01-catalog.spec.ts:21:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByText('Não foi possível concluir. Tente novamente.', { exact: true })
Expected: 0
Received: 1
Timeout:  8000ms

Call log:
  - Expect "toHaveCount" getByText('Não foi possível concluir. Tente novamente.', { exact: true }) with timeout 8000ms
  - waiting for getByText('Não foi possível concluir. Tente novamente.', { exact: true })
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
          - /url: /login?returnTo=%2F%3Fq%3DEmerald%23busca
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
            - searchbox "Buscar NFTs" [active] [ref=e109]: Emerald
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
          - generic [ref=e118]: 6 NFTs encontrados
          - tabpanel "Todos os NFTs" [ref=e119]:
            - generic [ref=e120]:
              - article [ref=e121]:
                - 'link "Ilustração de Emerald Ape #042 Emerald Ape #042 1.19 ETH" [ref=e122] [cursor=pointer]':
                  - /url: /nfts/nft-001
                  - 'img "Ilustração de Emerald Ape #042" [ref=e125]'
                  - generic [ref=e126]:
                    - 'heading "Emerald Ape #042" [level=3] [ref=e127]'
                    - generic [ref=e128]: 1.19 ETH
                - 'button "Favoritar Emerald Ape #042" [ref=e130]'
              - article [ref=e131]:
                - 'link "Ilustração de Emerald Ape #109 Emerald Ape #109 0.02 ETH" [ref=e132] [cursor=pointer]':
                  - /url: /nfts/nft-010
                  - 'img "Ilustração de Emerald Ape #109" [ref=e135]'
                  - generic [ref=e136]:
                    - 'heading "Emerald Ape #109" [level=3] [ref=e137]'
                    - generic [ref=e138]: 0.02 ETH
                - 'button "Favoritar Emerald Ape #109" [ref=e140]'
              - article [ref=e141]:
                - 'link "Ilustração de Emerald Ape #118 Emerald Ape #118 0.59 ETH" [ref=e142] [cursor=pointer]':
                  - /url: /nfts/nft-019
                  - 'img "Ilustração de Emerald Ape #118" [ref=e145]'
                  - generic [ref=e146]:
                    - 'heading "Emerald Ape #118" [level=3] [ref=e147]'
                    - generic [ref=e148]: 0.59 ETH
                - 'button "Favoritar Emerald Ape #118" [ref=e150]'
              - article [ref=e151]:
                - 'link "Ilustração de Emerald Ape #127 Emerald Ape #127 1.79 ETH" [ref=e152] [cursor=pointer]':
                  - /url: /nfts/nft-028
                  - 'img "Ilustração de Emerald Ape #127" [ref=e155]'
                  - generic [ref=e156]:
                    - 'heading "Emerald Ape #127" [level=3] [ref=e157]'
                    - generic [ref=e158]: 1.79 ETH
                - 'button "Favoritar Emerald Ape #127" [ref=e160]'
              - article [ref=e161]:
                - 'link "Ilustração de Emerald Ape #136 Emerald Ape #136 1.29 ETH" [ref=e162] [cursor=pointer]':
                  - /url: /nfts/nft-037
                  - 'img "Ilustração de Emerald Ape #136" [ref=e165]'
                  - generic [ref=e166]:
                    - 'heading "Emerald Ape #136" [level=3] [ref=e167]'
                    - generic [ref=e168]: 1.29 ETH
                - 'button "Favoritar Emerald Ape #136" [ref=e170]'
              - article [ref=e171]:
                - 'link "Ilustração de Emerald Ape #145 Emerald Ape #145 1.69 ETH" [ref=e172] [cursor=pointer]':
                  - /url: /nfts/nft-046
                  - 'img "Ilustração de Emerald Ape #145" [ref=e175]'
                  - generic [ref=e176]:
                    - 'heading "Emerald Ape #145" [level=3] [ref=e177]'
                    - generic [ref=e178]: 1.69 ETH
                - 'button "Favoritar Emerald Ape #145" [ref=e180]'
    - region "Explore as coleções" [ref=e181]:
      - article [ref=e182]:
        - img "Arte da coleção Kurio Apes" [ref=e184]
        - generic [ref=e185]:
          - heading "Lançamentos gênesis de edição limitada" [level=2] [ref=e186]
          - paragraph [ref=e187]: Colecione edições escassas diretamente dos criadores antes da revelação pública.
          - link "Explorar" [ref=e188] [cursor=pointer]:
            - /url: "#catalogo"
      - article [ref=e189]:
        - img "Arte da coleção Kurio Apes" [ref=e191]
        - generic [ref=e192]:
          - heading "Arte digital selecionada e muito mais" [level=2] [ref=e193]
          - paragraph [ref=e194]: Explore novos artistas, coleções verificadas e obras digitais que definem a cena.
          - link "Explorar" [ref=e195] [cursor=pointer]:
            - /url: "#catalogo"
    - generic [ref=e196]:
      - generic [ref=e197]:
        - heading "Diário da Cunhagem" [level=2] [ref=e198]
        - paragraph [ref=e199]: Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      - generic [ref=e200]:
        - article [ref=e201]:
          - img "Arte da coleção Kurio Apes" [ref=e203]
          - generic [ref=e204]:
            - paragraph [ref=e205]: 12 de setembro | Leitura de 6 min
            - heading "Como funciona a propriedade de NFTs" [level=3] [ref=e206]
            - paragraph [ref=e207]: Aprenda a colecionar, negociar e verificar ativos digitais.
            - button "Ler mais" [ref=e208] [cursor=pointer]
        - article [ref=e211]:
          - img "Arte da coleção Kurio Apes" [ref=e213]
          - generic [ref=e214]:
            - paragraph [ref=e215]: 13 de setembro | Leitura de 2 min
            - heading "10 artistas digitais para acompanhar" [level=3] [ref=e216]
            - paragraph [ref=e217]: Conheça criadores que moldam a cultura digital.
            - button "Ler mais" [ref=e218] [cursor=pointer]
        - article [ref=e221]:
          - img "Arte da coleção Kurio Apes" [ref=e223]
          - generic [ref=e224]:
            - paragraph [ref=e225]: 15 de setembro | Leitura de 3 min
            - heading "Raridade, atributos e procedência" [level=3] [ref=e226]
            - paragraph [ref=e227]: Entenda raridade, procedência, direitos autorais e utilidade.
            - button "Ler mais" [ref=e228] [cursor=pointer]
        - article [ref=e231]:
          - img "Arte da coleção Kurio Apes" [ref=e233]
          - generic [ref=e234]:
            - paragraph [ref=e235]: 15 de setembro | Leitura de 2 min
            - heading "Como proteger sua carteira" [level=3] [ref=e236]
            - paragraph [ref=e237]: Proteja sua carteira, seus ativos e sua identidade.
            - button "Ler mais" [ref=e238] [cursor=pointer]
    - generic [ref=e241]: Não foi possível concluir. Tente novamente.
  - contentinfo [ref=e243]:
    - generic [ref=e244]:
      - generic [ref=e245]:
        - generic [aria-hidden] [ref=e246]: W
        - heading "Segurança da carteira" [level=2] [ref=e247]
        - paragraph [ref=e248]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e249]:
        - generic [aria-hidden] [ref=e250]: C
        - heading "Criadores em destaque" [level=2] [ref=e251]
        - paragraph [ref=e252]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e253]:
        - generic [aria-hidden] [ref=e254]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e255]
        - paragraph [ref=e256]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e257]:
        - generic [ref=e258]: Antecipe-se ao próximo lançamento
        - generic [ref=e259]:
          - textbox "E-mail para newsletter" [ref=e260]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e261]
        - paragraph [ref=e262]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e263]:
      - strong [ref=e264]: KURIO
      - paragraph [ref=e265]: Feito para colecionadores,criadores e cultura
      - generic [ref=e266]: contato@email.com
      - generic [ref=e267]: +55 11 4002 8922
    - generic [ref=e268]:
      - generic [ref=e269]:
        - heading "Meu perfil" [level=2] [ref=e270]
        - link "Meu perfil" [ref=e271] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e272] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e273] [cursor=pointer]
        - button "Atividade" [ref=e274] [cursor=pointer]
        - link "Lista de interesse" [ref=e275] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e276]:
        - heading "Central de ajuda" [level=2] [ref=e277]
        - button "Central de ajuda" [ref=e278] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e279] [cursor=pointer]
        - button "Carteira e segurança" [ref=e280] [cursor=pointer]
        - button "Política do mercado" [ref=e281] [cursor=pointer]
        - button "Denunciar item" [ref=e282] [cursor=pointer]
      - generic [ref=e283]:
        - heading "Coleções" [level=2] [ref=e284]
        - link "Arte digital" [ref=e285] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e286] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e287] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e288] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e289] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e290]:
        - generic [ref=e291]:
          - heading "Redes sociais" [level=2] [ref=e292]
          - generic [ref=e293]:
            - button "Facebook" [ref=e294]
            - button "Instagram" [ref=e295]
            - button "Twitter" [ref=e296]
            - button "LinkedIn" [ref=e297]
            - button "YouTube" [ref=e298]
        - generic [ref=e299]:
          - heading "Carteiras compatíveis" [level=2] [ref=e300]
          - paragraph [ref=e301]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e302]: © 2026 Kurio. Propriedade digital para todos.
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from './fixtures/kurio';
  2   | 
  3   | test('digitação sequencial preserva espaços entre palavras na busca', async ({
  4   |   page,
  5   |   isMobile,
  6   | }) => {
  7   |   await page.goto('/');
  8   |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  9   |   const search = page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true });
  10  |   await search.pressSequentially('Cosmic Bloom', { delay: 80 });
  11  |   await search.press('Enter');
  12  |   await expect(search).toHaveValue('Cosmic Bloom');
  13  |   await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'Cosmic Bloom');
  14  |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText(
  15  |     'Cosmic Bloom',
  16  |   );
  17  |   await page.reload();
  18  |   await expect(search).toHaveValue('Cosmic Bloom');
  19  | });
  20  | 
  21  | test('substituir consultas durante a digitação não anuncia uma falha', async ({
  22  |   page,
  23  |   isMobile,
  24  | }) => {
  25  |   await page.goto('/');
  26  |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  27  |   const search = page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true });
  28  |   await search.pressSequentially('Emerald', { delay: 40 });
  29  |   await search.press('Enter');
  30  |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Emerald');
  31  |   await expect(
  32  |     page.getByText('Não foi possível concluir. Tente novamente.', { exact: true }),
> 33  |   ).toHaveCount(0);
      |     ^ Error: expect(locator).toHaveCount(expected) failed
  34  |   await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
  35  | });
  36  | 
  37  | test('busca, filtros e ordenação refletem API e URL', async ({ page, isMobile }) => {
  38  |   await page.goto('/');
  39  |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  40  |   await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Emerald');
  41  |   if (isMobile) await page.getByRole('button', { name: 'Filtros', exact: true }).click();
  42  |   await page.getByRole('checkbox', { name: 'Arte digital', exact: true }).check();
  43  |   await page.getByRole('checkbox', { name: 'Ethereum', exact: true }).check();
  44  |   await page.getByRole('combobox', { name: 'Ordenar por', exact: true }).selectOption('price_asc');
  45  |   if (isMobile) await page.getByRole('button', { name: 'Aplicar filtros', exact: true }).click();
  46  |   await expect(page).toHaveURL(/q=Emerald/);
  47  |   await expect(page).toHaveURL(/category=arte-digital/);
  48  |   await expect(page).toHaveURL(/network=ethereum/);
  49  |   await expect(page).toHaveURL(/sort=price_asc/);
  50  |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Emerald');
  51  | });
  52  | test('paginação, refresh e histórico preservam parâmetros', async ({ page, isMobile }) => {
  53  |   await page.goto('/');
  54  |   await page.getByRole('button', { name: 'Página 2', exact: true }).click();
  55  |   await expect(page).toHaveURL(/page=2/);
  56  |   await page.reload();
  57  |   await expect(page.getByRole('button', { name: 'Página 2', exact: true })).toHaveAttribute(
  58  |     'aria-current',
  59  |     'page',
  60  |   );
  61  |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  62  |   await page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true }).fill('Golden');
  63  |   await expect(page).not.toHaveURL(/page=2/);
  64  |   await page.goBack();
  65  |   await expect(page).toHaveURL(/page=2/);
  66  | });
  67  | test('vazio oferece limpar filtros e URL inválida não quebra página', async ({
  68  |   page,
  69  |   isMobile,
  70  | }) => {
  71  |   await page.goto('/?page=abc&minPrice=-1');
  72  |   await expect(page.getByTestId('nft-grid')).toBeVisible();
  73  |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  74  |   await page
  75  |     .getByRole('searchbox', { name: 'Buscar NFTs', exact: true })
  76  |     .fill('colecao-inexistente');
  77  |   await expect(page.getByRole('heading', { name: 'Nenhum NFT encontrado' })).toBeVisible();
  78  |   await page.getByRole('button', { name: 'Limpar filtros', exact: true }).last().click();
  79  |   await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  80  | });
  81  | test('falha 500 mostra erro e nova tentativa recupera', async ({ page }) => {
  82  |   await page.goto('/?scenario=server-error-reads');
  83  |   await expect(page.getByRole('heading', { name: 'Não foi possível carregar' })).toBeVisible();
  84  |   await page.evaluate(() => {
  85  |     window.__kurio.setScenario('default');
  86  |   });
  87  |   await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  88  |   await expect(page.getByTestId('nft-grid')).toBeVisible();
  89  | });
  90  | test('rede lenta mostra skeletons com dimensões e reduced motion', async ({ page }) => {
  91  |   await page.goto('/?scenario=slow-network');
  92  |   await expect(page.getByLabel('Carregando NFT').first()).toBeVisible();
  93  |   await expect(page.getByTestId('nft-grid').getByRole('link')).toHaveCount(9);
  94  | });
  95  | test('respostas fora de ordem mantêm a busca mais recente', async ({ page, isMobile }) => {
  96  |   await page.goto('/?scenario=out-of-order');
  97  |   if (!isMobile) await page.getByRole('link', { name: 'Buscar NFTs', exact: true }).click();
  98  |   const search = page.getByRole('searchbox', { name: 'Buscar NFTs', exact: true });
  99  |   await search.fill('Emerald');
  100 |   await search.fill('Golden');
  101 |   await expect(page.getByTestId('nft-grid').getByRole('link').first()).toContainText('Golden');
  102 |   await expect(page).toHaveURL(/q=Golden/);
  103 | });
  104 | 
```