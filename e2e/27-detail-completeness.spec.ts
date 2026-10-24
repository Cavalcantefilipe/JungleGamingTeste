import { addNft } from './fixtures/checkout';
import { expect, test } from './fixtures/kurio';

test('coleção do nft-004 avança sozinha, volta ao início e permite pausar', async ({ page }) => {
  await page.goto('/nfts/nft-004');
  const carousel = page.getByRole('region', { name: 'Mais desta coleção', exact: true });
  await expect(carousel).toBeVisible();
  await carousel.scrollIntoViewIfNeeded();
  const dots = carousel.getByRole('button', { name: /Ir para página/ });
  expect(await dots.count()).toBeGreaterThan(1);
  await page.mouse.move(0, 0);
  await page.clock.install();
  await page.clock.runFor(5500);
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'page');
  await carousel.getByRole('button', { name: 'Pausar carrossel' }).click();
  await dots.last().click();
  await expect(dots.last()).toHaveAttribute('aria-current', 'page');
  await page.clock.runFor(5500);
  await expect(dots.last()).toHaveAttribute('aria-current', 'page');
  await carousel.getByRole('button', { name: 'Reproduzir carrossel' }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(5500);
  await expect(dots.first()).toHaveAttribute('aria-current', 'page');
});

test('coleção respeita movimento reduzido e os pontos navegam por todos os itens', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/nfts/nft-004');
  const carousel = page.getByRole('region', { name: 'Mais desta coleção', exact: true });
  await expect(carousel.getByRole('listitem')).toHaveCount(15);
  await expect(carousel.locator('a[href="/nfts/nft-004"]')).toHaveCount(0);
  await carousel.scrollIntoViewIfNeeded();
  const dots = carousel.getByRole('button', { name: /Ir para página/ });
  await page.clock.install();
  await page.clock.runFor(5500);
  await expect(dots.first()).toHaveAttribute('aria-current', 'page');
  await dots.last().click();
  await expect(dots.last()).toHaveAttribute('aria-current', 'page');
  await dots.first().click();
  await expect
    .poll(() => carousel.getByRole('list').evaluate((element) => element.scrollLeft))
    .toBeLessThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('avaliações dos compradores carregam da API e paginam sem repetir comentários', async ({
  page,
}) => {
  await page.goto('/nfts/nft-004');
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes('/nfts/nft-004/reviews?'),
  );
  await page.getByRole('tab', { name: /Avaliações/ }).click();
  expect((await responsePromise).ok()).toBe(true);
  const panel = page.getByRole('tabpanel');
  await expect(panel.getByRole('heading', { name: 'Avaliações de compradores' })).toBeVisible();
  await expect(panel.getByRole('article')).toHaveCount(4);
  await expect(panel).toContainText('22 avaliações');
  const firstReview = await panel.getByRole('article').first().getAttribute('aria-label');
  await panel.getByRole('button', { name: 'Próximas avaliações' }).click();
  await expect(panel.getByText('Página 2 de 6', { exact: true })).toBeVisible();
  await expect(panel.getByRole('article').first()).not.toHaveAttribute(
    'aria-label',
    firstReview ?? '',
  );
  await panel.getByRole('button', { name: 'Avaliações anteriores' }).click();
  await expect(panel.getByRole('article').first()).toHaveAttribute('aria-label', firstReview ?? '');
  await expect(panel).not.toContainText('indisponíveis nesta demonstração');
});

test('avaliações mostram carregamento e permitem recuperar uma falha de rede', async ({ page }) => {
  await page.goto('/nfts/nft-004');
  await expect(page.getByTestId('gallery-image')).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 900, failRate: 1 });
  });
  await page.getByRole('tab', { name: /Avaliações/ }).click();
  await expect(page.getByRole('status', { name: 'Carregando avaliações' })).toBeVisible();
  const panel = page.getByRole('tabpanel');
  await expect(panel.getByRole('alert')).toBeVisible({ timeout: 15000 });
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 0, failRate: 0 });
  });
  await panel.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(panel.getByRole('article')).toHaveCount(4);
});

test('carrinho reutiliza avanço automático, pausa no hover e pontinhos', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'A referência do carrinho exibe recomendações no desktop');
  await addNft(page, isMobile);
  const carousel = page.getByRole('region', { name: 'Colecionadores também viram' });
  await carousel.scrollIntoViewIfNeeded();
  const dots = carousel.getByRole('button', { name: /Ir para página/ });
  await expect(dots).toHaveCount(3);
  await page.mouse.move(0, 0);
  await page.clock.install();
  await page.clock.runFor(5500);
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'page');
  await carousel.getByRole('heading', { name: 'Colecionadores também viram' }).hover();
  await page.clock.runFor(5500);
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'page');
  await dots.first().click();
  await expect(dots.first()).toHaveAttribute('aria-current', 'page');
});

test('nft-004 mostra os metadados completos e coerentes com sua rede e coleção', async ({
  page,
}) => {
  await page.goto('/nfts/nft-004');
  const summary = page.getByTestId('detail-summary');
  await expect(summary).toContainText('Kurio Apes, na Polygon');
  const details = page.getByRole('tabpanel');
  await expect(details).toContainText('Cosmic Bloom #118 é uma obra digital');
  await expect(details).toContainText('Procedência na Polygon');
  await expect(details).toContainText('IPFS');
  await expect(details).toContainText('Contrato');
  await expect(details).toContainText('ERC-721');
  await expect(details).toContainText('Direitos autorais');
  await expect(details).toContainText('5%');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('migração do detalhe mantém o carrinho salvo em uma versão anterior', async ({
  page,
  isMobile,
}) => {
  await addNft(page, isMobile, 'nft-004');
  await page.evaluate(() => {
    const state = window.__kurio.getState();
    localStorage.setItem(
      'kurio.mockdb.v1',
      JSON.stringify({
        ...state,
        catalogRevision: 2,
        nfts: state.nfts.map((nft) => ({
          ...nft,
          details: undefined,
          description: 'Descrição antiga',
        })),
      }),
    );
  });
  await page.reload();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await expect(page.getByTestId('cart-item')).toContainText('Cosmic Bloom #118');
  await page.goto('/nfts/nft-004');
  await expect(page.getByTestId('detail-summary')).toContainText('Kurio Apes, na Polygon');
  await expect(page.getByRole('tabpanel')).toContainText('Direitos autorais');
});

test('avaliações preservam aba e página no refresh e no histórico', async ({ page }) => {
  await page.goto('/nfts/nft-004');
  await page.getByRole('tab', { name: /Avaliações/ }).click();
  const panel = page.getByRole('tabpanel');
  await panel.getByRole('button', { name: 'Próximas avaliações' }).click();
  await expect(panel).toContainText('Página 2 de 6');
  await expect(page).toHaveURL(/tab=reviews.*reviewPage=2/);
  await page.reload();
  await expect(page.getByRole('tab', { name: /Avaliações/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(panel).toContainText('Página 2 de 6');
  await page.goBack();
  await expect(panel).toContainText('Página 1 de 6');
});

test('evento de preço não interrompe avaliações em carregamento', async ({ page, isMobile }) => {
  await page.goto('/nfts/nft-004');
  await expect(page.getByTestId('gallery-image')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__kurio.getConnections().length)).toBe(1);
  await page.evaluate(() => {
    window.__kurio.setNetwork({ latencyMs: 1500 });
  });
  await page.getByRole('tab', { name: /Avaliações/ }).click();
  await expect(page.getByRole('status', { name: 'Carregando avaliações' })).toBeVisible();
  await page.evaluate(() => {
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: 'nft-004' },
      occurredAt: new Date().toISOString(),
      version: 2,
      payload: { price: '2.75' },
    });
  });
  await expect(page.getByRole('tabpanel').getByRole('article')).toHaveCount(4);
  const price = isMobile ? page.getByTestId('mobile-purchase-bar') : page.getByTestId('nft-price');
  await expect(price).toContainText('2.75 ETH');
});
