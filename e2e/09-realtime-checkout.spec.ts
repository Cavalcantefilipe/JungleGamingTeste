import { test, expect } from './fixtures/kurio';

test('preço muda via socket no detalhe sem nova chamada REST', async ({ page, isMobile }) => {
  let requests = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/nfts/nft-001') requests++;
  });
  await page.goto('/nfts/nft-001');
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__kurio.getConnections().length)).toBe(1);
  const before = requests;
  await page.evaluate(() => {
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: 'nft-001' },
      occurredAt: new Date().toISOString(),
      version: 2,
      payload: { price: '2.75' },
    });
  });
  const price = isMobile ? page.getByTestId('mobile-purchase-bar') : page.getByTestId('nft-price');
  await expect(price).toContainText('2.75 ETH');
  expect(requests).toBe(before);
  await page.reload();
  await expect(price).toContainText('2.75 ETH');
});

test('eventos antigos não regridem preço e reconexão reconcilia com REST', async ({
  page,
  isMobile,
}) => {
  await page.goto('/nfts/nft-001');
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__kurio.getConnections().length)).toBe(1);
  await page.evaluate(() => {
    const event = {
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: 'nft-001' },
      occurredAt: new Date().toISOString(),
      version: 3,
      payload: { price: '3.25' },
    };
    window.__kurio.emit(event);
    window.__kurio.emit({
      ...event,
      id: crypto.randomUUID(),
      version: 2,
      payload: { price: '0.1' },
    });
  });
  const price = isMobile ? page.getByTestId('mobile-purchase-bar') : page.getByTestId('nft-price');
  await expect(price).toContainText('3.25 ETH');
  await page.evaluate(() => {
    window.__kurio.disconnectSocket();
  });
  await expect.poll(() => page.evaluate(() => window.__kurio.getConnections().length)).toBe(0);
  await page.evaluate(() => {
    window.__kurio.emit({
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: 'nft-001' },
      occurredAt: new Date().toISOString(),
      version: 4,
      payload: { price: '4.25' },
    });
  });
  await expect(price).toContainText('3.25 ETH');
  await page.evaluate(() => {
    window.__kurio.reconnectSocket();
  });
  await expect(price).toContainText('4.25 ETH');
});
