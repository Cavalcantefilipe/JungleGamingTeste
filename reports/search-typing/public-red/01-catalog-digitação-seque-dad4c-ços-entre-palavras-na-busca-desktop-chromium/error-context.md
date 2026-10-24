# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-catalog.spec.ts >> digitação sequencial preserva espaços entre palavras na busca
- Location: e2e/01-catalog.spec.ts:3:1

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByRole('searchbox', { name: 'Buscar NFTs', exact: true })
Expected: "Cosmic Bloom"
Received: "CosmicBloom"
Timeout:  8000ms

Call log:
  - Expect "toHaveValue" getByRole('searchbox', { name: 'Buscar NFTs', exact: true }) with timeout 8000ms
  - waiting for getByRole('searchbox', { name: 'Buscar NFTs', exact: true })
    20 × locator resolved to <input id="busca" type="search" data-slot="input" value="CosmicBloom" aria-label="Buscar NFTs" placeholder="Buscar NFTs, coleções e criadores..." class="w-full min-w-0 rounded-field border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-secondary disabled:pointer-event…/>
       - unexpected value "CosmicBloom"

```

```yaml
- searchbox "Buscar NFTs": CosmicBloom
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
> 12  |   await expect(search).toHaveValue('Cosmic Bloom');
      |                        ^ Error: expect(locator).toHaveValue(expected) failed
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
  33  |   ).toHaveCount(0);
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