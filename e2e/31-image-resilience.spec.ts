import { expect, test } from './fixtures/kurio';

import type { Locator } from '@playwright/test';

async function expectLoaded(image: Locator) {
  await expect
    .poll(() =>
      image.evaluate(
        (element) =>
          element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
}

test.describe('recuperação de falhas de arquivos', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Firefox/WebKit não interceptam com context.route as imagens buscadas pelo service worker MSW',
  );

  test('falha AVIF recupera galeria e carrossel com o mesmo artwork WebP', async ({
    page,
    context,
  }) => {
    await context.route('**/images/nfts/*.avif', (route) => route.abort('failed'));
    await page.goto('/nfts/nft-004');
    const gallery = page.getByTestId('gallery-image');
    await expectLoaded(gallery);
    await expect
      .poll(() =>
        gallery.evaluate((element) =>
          element instanceof HTMLImageElement ? element.currentSrc : '',
        ),
      )
      .toMatch(/sage-\d+\.webp$/);
    const related = page.getByRole('region', { name: 'Mais desta coleção', exact: true });
    await related.scrollIntoViewIfNeeded();
    await expectLoaded(related.locator('img').first());
    await expect
      .poll(() =>
        related
          .locator('img')
          .first()
          .evaluate((element) => (element instanceof HTMLImageElement ? element.currentSrc : '')),
      )
      .toMatch(/\.webp$/);
    await related
      .getByRole('button', { name: /Ir para página .* das recomendações/ })
      .last()
      .click();
    await expectLoaded(related.locator('img').last());
  });

  test('Home recupera cards e libera AVIF ao trocar o destaque para outra foto', async ({
    page,
    context,
  }) => {
    await context.route('**/images/nfts/emerald-*.avif', (route) => route.abort('failed'));
    await page.goto('/');
    const hero = page.getByTestId('home-hero');
    const image = hero.getByRole('img', { name: 'Ilustração de Emerald Ape #042', exact: true });
    await expectLoaded(image);
    await expect
      .poll(() =>
        image.evaluate((element) =>
          element instanceof HTMLImageElement ? element.currentSrc : '',
        ),
      )
      .toMatch(/emerald-\d+\.webp$/);
    await expectLoaded(page.getByTestId('nft-grid').locator('img').first());
    await hero.getByRole('button', { name: 'Mostrar destaque 2', exact: true }).click();
    const nextImage = hero.getByRole('img', { name: 'Ilustração de Sage Nomad #009', exact: true });
    await expectLoaded(nextImage);
    await expect
      .poll(() =>
        nextImage.evaluate((element) =>
          element instanceof HTMLImageElement ? element.currentSrc : '',
        ),
      )
      .toMatch(/sage-\d+\.avif$/);
  });

  test('falha transitória nos dois formatos tenta novamente o arquivo original', async ({
    page,
    context,
  }) => {
    await context.route('**/images/nfts/*', (route) =>
      new URL(route.request().url()).searchParams.has('kurio_retry')
        ? route.continue()
        : route.abort('failed'),
    );
    await page.goto('/nfts/nft-004');
    const gallery = page.getByTestId('gallery-image');
    await expectLoaded(gallery);
    await expect
      .poll(() =>
        gallery.evaluate((element) =>
          element instanceof HTMLImageElement ? element.currentSrc : '',
        ),
      )
      .toMatch(/sage-800\.webp\?kurio_retry=1$/);
  });

  test('indisponibilidade preserva espaço e recupera imagens quando a conexão volta', async ({
    page,
    context,
  }) => {
    let unavailable = true;
    await context.route('**/images/nfts/*', (route) =>
      unavailable ? route.abort('failed') : route.continue(),
    );
    await page.goto('/nfts/nft-004');
    const gallery = page.getByTestId('gallery-image');
    await expect(gallery).toHaveAttribute('data-artwork-state', 'unavailable');
    await expect(gallery).toHaveAccessibleName(/Imagem indisponível/);
    const before = await page.getByTestId('gallery-frame').boundingBox();
    unavailable = false;
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expectLoaded(gallery);
    const after = await page.getByTestId('gallery-frame').boundingBox();
    expect(after?.width).toBe(before?.width);
    expect(after?.height).toBe(before?.height);
  });

  for (const resumeEvent of ['visibilitychange', 'focus']) {
    test(`Home recupera foto indisponível ao retornar por ${resumeEvent}`, async ({
      page,
      context,
    }) => {
      let unavailable = true;
      await context.route('**/images/nfts/*', (route) =>
        unavailable ? route.abort('failed') : route.continue(),
      );
      await page.goto('/');
      const hero = page.getByTestId('home-hero');
      const image = hero.getByRole('img', { name: /Ilustração de Emerald Ape #042/ });
      await expect(image).toHaveAttribute('data-artwork-state', 'unavailable');
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      unavailable = false;
      await page.evaluate((event) => {
        Object.defineProperty(document, 'visibilityState', {
          configurable: true,
          value: 'visible',
        });
        if (event === 'visibilitychange') document.dispatchEvent(new Event(event));
        else window.dispatchEvent(new Event(event));
      }, resumeEvent);
      await expectLoaded(image);
    });
  }

  test('voltar ao destaque que falhou tenta a imagem novamente', async ({ page, context }) => {
    let unavailable = true;
    await context.route('**/images/nfts/emerald-*', (route) =>
      unavailable ? route.abort('failed') : route.continue(),
    );
    await page.goto('/');
    const hero = page.getByTestId('home-hero');
    const image = hero.getByRole('img', { name: /Ilustração de Emerald Ape #042/ });
    await expect(image).toHaveAttribute('data-artwork-state', 'unavailable');
    await hero.getByRole('button', { name: 'Mostrar destaque 2', exact: true }).click();
    await expectLoaded(
      hero.getByRole('img', { name: 'Ilustração de Sage Nomad #009', exact: true }),
    );
    unavailable = false;
    await hero.getByRole('button', { name: 'Mostrar destaque 1', exact: true }).click();
    await expectLoaded(image);
  });

  test('imagem indisponível mantém a área de visualização do zoom', async ({
    page,
    context,
    isMobile,
  }) => {
    test.skip(isMobile, 'Ampliação disponível no layout desktop');
    await context.route('**/images/nfts/*', (route) => route.abort('failed'));
    await page.goto('/nfts/nft-004');
    await page.getByRole('button', { name: 'Ampliar imagem', exact: true }).click();
    const image = page.getByRole('dialog').getByRole('img', { name: /Imagem indisponível/ });
    await expect(image).toBeVisible();
    const box = await image.boundingBox();
    expect(box?.width).toBeGreaterThan(600);
    expect(box?.height).toBeGreaterThan(600);
  });

  test('trocar foto na galeria não reaproveita o erro da imagem anterior', async ({
    page,
    context,
    isMobile,
  }) => {
    test.skip(isMobile, 'Miniaturas disponíveis no layout desktop');
    await context.route('**/images/nfts/sage-*.avif', (route) => route.abort('failed'));
    await page.goto('/nfts/nft-004');
    await expectLoaded(page.getByTestId('gallery-image'));
    await page.evaluate(() => {
      const database = window.__kurio.getState();
      const alternate = database.nfts.find((nft) => nft.id === 'nft-007')?.images[0];
      if (!alternate) throw new Error('Artwork alternativo ausente');
      localStorage.setItem(
        'kurio.mockdb.v1',
        JSON.stringify({
          ...database,
          nfts: database.nfts.map((nft) =>
            nft.id === 'nft-004' ? { ...nft, images: [nft.images[0], alternate] } : nft,
          ),
        }),
      );
    });
    await page.reload();
    await expectLoaded(page.getByTestId('gallery-image'));
    await page.getByRole('button', { name: 'Ver imagem 2', exact: true }).click();
    const gallery = page.getByTestId('gallery-image');
    await expectLoaded(gallery);
    await expect
      .poll(() =>
        gallery.evaluate((element) =>
          element instanceof HTMLImageElement ? element.currentSrc : '',
        ),
      )
      .toMatch(/golden-\d+\.avif$/);
  });
});

test('Home preserva foto carregada ao alternar offline e online com retorno à aba', async ({
  page,
  context,
}) => {
  await page.goto('/');
  const image = page.getByTestId('home-hero').getByRole('img', {
    name: 'Ilustração de Emerald Ape #042',
    exact: true,
  });
  await expectLoaded(image);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await context.setOffline(true);
  await expectLoaded(image);
  await context.setOffline(false);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('focus'));
  });
  await expectLoaded(image);
});
