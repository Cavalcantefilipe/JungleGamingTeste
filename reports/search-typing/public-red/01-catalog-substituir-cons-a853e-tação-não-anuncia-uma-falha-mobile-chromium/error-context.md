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
  - main [ref=e4]:
    - generic [ref=e5]:
      - searchbox "Buscar NFTs" [active] [ref=e7]: Emerald
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
        - generic [ref=e35]: 6 NFTs encontrados
        - tabpanel "Todos os NFTs" [ref=e36]:
          - generic [ref=e37]:
            - article [ref=e38]:
              - 'link "Ilustração de Emerald Ape #042 Emerald Ape #042 1.19 ETH" [ref=e39] [cursor=pointer]':
                - /url: /nfts/nft-001
                - 'img "Ilustração de Emerald Ape #042" [ref=e42]'
                - generic [ref=e43]:
                  - 'heading "Emerald Ape #042" [level=3] [ref=e44]'
                  - generic [ref=e45]: 1.19 ETH
              - 'button "Favoritar Emerald Ape #042" [ref=e47]'
            - article [ref=e48]:
              - 'link "Ilustração de Emerald Ape #109 Emerald Ape #109 0.02 ETH" [ref=e49] [cursor=pointer]':
                - /url: /nfts/nft-010
                - 'img "Ilustração de Emerald Ape #109" [ref=e52]'
                - generic [ref=e53]:
                  - 'heading "Emerald Ape #109" [level=3] [ref=e54]'
                  - generic [ref=e55]: 0.02 ETH
              - 'button "Favoritar Emerald Ape #109" [ref=e57]'
            - article [ref=e58]:
              - 'link "Ilustração de Emerald Ape #118 Emerald Ape #118 0.59 ETH" [ref=e59] [cursor=pointer]':
                - /url: /nfts/nft-019
                - 'img "Ilustração de Emerald Ape #118" [ref=e62]'
                - generic [ref=e63]:
                  - 'heading "Emerald Ape #118" [level=3] [ref=e64]'
                  - generic [ref=e65]: 0.59 ETH
              - 'button "Favoritar Emerald Ape #118" [ref=e67]'
            - article [ref=e68]:
              - 'link "Ilustração de Emerald Ape #127 Emerald Ape #127 1.79 ETH" [ref=e69] [cursor=pointer]':
                - /url: /nfts/nft-028
                - 'img "Ilustração de Emerald Ape #127" [ref=e72]'
                - generic [ref=e73]:
                  - 'heading "Emerald Ape #127" [level=3] [ref=e74]'
                  - generic [ref=e75]: 1.79 ETH
              - 'button "Favoritar Emerald Ape #127" [ref=e77]'
            - article [ref=e78]:
              - 'link "Ilustração de Emerald Ape #136 Emerald Ape #136 1.29 ETH" [ref=e79] [cursor=pointer]':
                - /url: /nfts/nft-037
                - 'img "Ilustração de Emerald Ape #136" [ref=e82]'
                - generic [ref=e83]:
                  - 'heading "Emerald Ape #136" [level=3] [ref=e84]'
                  - generic [ref=e85]: 1.29 ETH
              - 'button "Favoritar Emerald Ape #136" [ref=e87]'
            - article [ref=e88]:
              - 'link "Ilustração de Emerald Ape #145 Emerald Ape #145 1.69 ETH" [ref=e89] [cursor=pointer]':
                - /url: /nfts/nft-046
                - 'img "Ilustração de Emerald Ape #145" [ref=e92]'
                - generic [ref=e93]:
                  - 'heading "Emerald Ape #145" [level=3] [ref=e94]'
                  - generic [ref=e95]: 1.69 ETH
              - 'button "Favoritar Emerald Ape #145" [ref=e97]'
    - region "Explore as coleções" [ref=e98]:
      - article [ref=e99]:
        - img "Arte da coleção Kurio Apes" [ref=e101]
        - generic [ref=e102]:
          - heading "Lançamentos gênesis de edição limitada" [level=2] [ref=e103]
          - paragraph [ref=e104]: Colecione edições escassas diretamente dos criadores antes da revelação pública.
          - link "Explorar" [ref=e105] [cursor=pointer]:
            - /url: "#catalogo"
      - article [ref=e106]:
        - img "Arte da coleção Kurio Apes" [ref=e108]
        - generic [ref=e109]:
          - heading "Arte digital selecionada e muito mais" [level=2] [ref=e110]
          - paragraph [ref=e111]: Explore novos artistas, coleções verificadas e obras digitais que definem a cena.
          - link "Explorar" [ref=e112] [cursor=pointer]:
            - /url: "#catalogo"
    - generic [ref=e113]:
      - generic [ref=e114]:
        - heading "Diário da Cunhagem" [level=2] [ref=e115]
        - paragraph [ref=e116]: Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      - generic [ref=e117]:
        - article [ref=e118]:
          - img "Arte da coleção Kurio Apes" [ref=e120]
          - generic [ref=e121]:
            - paragraph [ref=e122]: 12 de setembro | Leitura de 6 min
            - heading "Como funciona a propriedade de NFTs" [level=3] [ref=e123]
            - paragraph [ref=e124]: Aprenda a colecionar, negociar e verificar ativos digitais.
            - button "Ler mais" [ref=e125] [cursor=pointer]
        - article [ref=e128]:
          - img "Arte da coleção Kurio Apes" [ref=e130]
          - generic [ref=e131]:
            - paragraph [ref=e132]: 13 de setembro | Leitura de 2 min
            - heading "10 artistas digitais para acompanhar" [level=3] [ref=e133]
            - paragraph [ref=e134]: Conheça criadores que moldam a cultura digital.
            - button "Ler mais" [ref=e135] [cursor=pointer]
        - article [ref=e138]:
          - img "Arte da coleção Kurio Apes" [ref=e140]
          - generic [ref=e141]:
            - paragraph [ref=e142]: 15 de setembro | Leitura de 3 min
            - heading "Raridade, atributos e procedência" [level=3] [ref=e143]
            - paragraph [ref=e144]: Entenda raridade, procedência, direitos autorais e utilidade.
            - button "Ler mais" [ref=e145] [cursor=pointer]
        - article [ref=e148]:
          - img "Arte da coleção Kurio Apes" [ref=e150]
          - generic [ref=e151]:
            - paragraph [ref=e152]: 15 de setembro | Leitura de 2 min
            - heading "Como proteger sua carteira" [level=3] [ref=e153]
            - paragraph [ref=e154]: Proteja sua carteira, seus ativos e sua identidade.
            - button "Ler mais" [ref=e155] [cursor=pointer]
    - generic [ref=e158]: Não foi possível concluir. Tente novamente.
  - contentinfo [ref=e160]:
    - generic [ref=e161]:
      - generic [ref=e162]:
        - generic [aria-hidden] [ref=e163]: W
        - heading "Segurança da carteira" [level=2] [ref=e164]
        - paragraph [ref=e165]: Proteja sua carteira e colecione arte digital verificada com confiança.
      - generic [ref=e166]:
        - generic [aria-hidden] [ref=e167]: C
        - heading "Criadores em destaque" [level=2] [ref=e168]
        - paragraph [ref=e169]: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      - generic [ref=e170]:
        - generic [aria-hidden] [ref=e171]: D
        - heading "Alertas de lançamentos" [level=2] [ref=e172]
        - paragraph [ref=e173]: Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.
      - generic [ref=e174]:
        - generic [ref=e175]: Antecipe-se ao próximo lançamento
        - generic [ref=e176]:
          - textbox "E-mail para newsletter" [ref=e177]:
            - /placeholder: Digite seu e-mail...
          - button "Enviar" [ref=e178]
        - paragraph [ref=e179]: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
    - generic [ref=e180]:
      - strong [ref=e181]: KURIO
      - paragraph [ref=e182]: Feito para colecionadores,criadores e cultura
      - generic [ref=e183]: contato@email.com
      - generic [ref=e184]: +55 11 4002 8922
    - generic [ref=e185]:
      - generic [ref=e186]:
        - heading "Meu perfil" [level=2] [ref=e187]
        - link "Meu perfil" [ref=e188] [cursor=pointer]:
          - /url: /account/profile
        - link "Minhas carteiras" [ref=e189] [cursor=pointer]:
          - /url: /account/wallets
        - button "Minha coleção" [ref=e190] [cursor=pointer]
        - button "Atividade" [ref=e191] [cursor=pointer]
        - link "Lista de interesse" [ref=e192] [cursor=pointer]:
          - /url: /?favorites=true
      - generic [ref=e193]:
        - heading "Central de ajuda" [level=2] [ref=e194]
        - button "Central de ajuda" [ref=e195] [cursor=pointer]
        - button "Como comprar NFTs" [ref=e196] [cursor=pointer]
        - button "Carteira e segurança" [ref=e197] [cursor=pointer]
        - button "Política do mercado" [ref=e198] [cursor=pointer]
        - button "Denunciar item" [ref=e199] [cursor=pointer]
      - generic [ref=e200]:
        - heading "Coleções" [level=2] [ref=e201]
        - link "Arte digital" [ref=e202] [cursor=pointer]:
          - /url: /?category=arte-digital#catalogo
        - link "Fotografia" [ref=e203] [cursor=pointer]:
          - /url: /?category=fotografia#catalogo
        - link "Música" [ref=e204] [cursor=pointer]:
          - /url: /?category=musica#catalogo
        - link "Arte 3D" [ref=e205] [cursor=pointer]:
          - /url: /?category=arte-3d#catalogo
        - link "Utilidade" [ref=e206] [cursor=pointer]:
          - /url: /?category=utilidade#catalogo
      - generic [ref=e207]:
        - generic [ref=e208]:
          - heading "Redes sociais" [level=2] [ref=e209]
          - generic [ref=e210]:
            - button "Facebook" [ref=e211]
            - button "Instagram" [ref=e212]
            - button "Twitter" [ref=e213]
            - button "LinkedIn" [ref=e214]
            - button "YouTube" [ref=e215]
        - generic [ref=e216]:
          - heading "Carteiras compatíveis" [level=2] [ref=e217]
          - paragraph [ref=e218]: METAMASK · WALLETCONNECT · COINBASE
    - paragraph [ref=e219]: © 2026 Kurio. Propriedade digital para todos.
  - navigation "Navegação mobile" [ref=e220]:
    - link "Início" [ref=e221] [cursor=pointer]:
      - /url: /
    - link "Favoritos" [ref=e224] [cursor=pointer]:
      - /url: /login?returnTo=%2F%3Ffavorites%3Dtrue
    - link "Explorar mercado" [ref=e227] [cursor=pointer]:
      - /url: /#catalogo
    - link "Abrir carrinho, 0 itens" [ref=e230] [cursor=pointer]:
      - /url: /cart
    - link "Perfil" [ref=e233] [cursor=pointer]:
      - /url: /account/profile
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