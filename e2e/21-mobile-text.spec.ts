import { reviewAndConnect } from './fixtures/checkout';
import { expect, login, test } from './fixtures/kurio';

import type { Page } from '@playwright/test';

async function expectReadableText(page: Page) {
  await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  const clipped = await page.evaluate(() => {
    const failures: string[] = [];
    function checkClipping(element: HTMLElement, rect: DOMRect, text: string) {
      let ancestor: HTMLElement | null = element;
      while (ancestor && ancestor !== document.body) {
        const style = getComputedStyle(ancestor);
        const clip = ancestor.getBoundingClientRect();
        if (['hidden', 'clip'].includes(style.overflowY) && rect.bottom > clip.bottom + 1)
          failures.push(`Altura: ${text}`);
        if (
          ['hidden', 'clip'].includes(style.overflowX) &&
          (rect.left < clip.left - 1 || rect.right > clip.right + 1)
        )
          failures.push(`Largura: ${text}`);
        ancestor = ancestor.parentElement;
      }
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const element = node.parentElement;
      const text = node.textContent?.trim();
      if (!text || !element?.checkVisibility()) continue;
      if (element.closest('.sr-only,[aria-hidden="true"],script,style')) continue;
      const range = document.createRange();
      range.selectNode(node);
      for (const rect of range.getClientRects()) {
        if (rect.width < 2 || rect.height < 2) continue;
        if (rect.left < -1 || rect.right > innerWidth + 1) failures.push(`Viewport: ${text}`);
        checkClipping(element, rect, text);
      }
    }
    return [...new Set(failures)];
  });
  expect(clipped).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const width of [320, 360, 375, 390, 414]) {
  test(`textos completos e ações acessíveis em ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile-chromium', 'Matriz específica para mobile');
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page.getByTestId('nft-grid').locator('article')).toHaveCount(9);
    await expectReadableText(page);
    const hero = page.getByTestId('home-hero');
    const description = hero.locator('p').last();
    const explore = hero
      .getByRole('link', { name: 'EXPLORAR', exact: true })
      .filter({ visible: true });
    const descriptionBox = await description.boundingBox();
    const exploreBox = await explore.boundingBox();
    expect(
      descriptionBox && exploreBox && descriptionBox.y + descriptionBox.height <= exploreBox.y,
    ).toBe(true);
    for (const highlight of await hero.getByRole('button', { name: /Mostrar destaque/ }).all()) {
      await highlight.click();
      await expect(highlight).toHaveAttribute('aria-pressed', 'true');
    }
    await page.goto('/nfts/nft-001');
    await expect(page.getByTestId('gallery-image')).toBeVisible();
    await expectReadableText(page);
    await page.getByRole('button', { name: 'Comprar NFT', exact: true }).click();
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await expect(page.getByTestId('quote-total')).toBeVisible();
    await expectReadableText(page);
    const row = page.getByTestId('cart-item');
    const title = await row.getByRole('heading').boundingBox();
    const remove = await row.getByRole('button', { name: /Remover/ }).boundingBox();
    expect(title && remove && title.x + title.width <= remove.x).toBe(true);
    await page.goto('/login');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectReadableText(page);
    await page.goto('/register');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectReadableText(page);
    await login(page);
    await expect(page.getByLabel('Nome de exibição', { exact: true })).toHaveValue('Ana Costa');
    await expectReadableText(page);
    await page.goto('/account/wallets');
    await expect(
      page.getByRole('heading', { name: 'Carteira principal', exact: true }),
    ).toBeVisible();
    await expectReadableText(page);
    await page.goto('/checkout');
    await reviewAndConnect(page);
    await expectReadableText(page);
    await page.getByRole('button', { name: 'Confirmar compra', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira', exact: true }),
    ).toBeVisible();
    await expectReadableText(page);
  });
}
