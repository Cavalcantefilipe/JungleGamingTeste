import { describe, expect, it } from 'vitest';

import { createSeed } from '@/mocks/db/seed';
import { createPendingOrder } from '@/mocks/shared/createPendingOrder';
import { computeQuote } from '@/mocks/shared/pricing';

import { orderSchema } from './order';

function currentOrder() {
  const seed = createSeed();
  const nft = seed.nfts[0];
  const edition = nft?.editions[0];
  const wallet = seed.wallets['user-ana']?.primary;
  if (!nft || !edition || !wallet) throw new Error('Fixture ausente');
  const items = [{ nftId: nft.id, editionId: edition.id, quantity: 1 }];
  const quote = computeQuote(seed, { items, network: wallet.network });
  return createPendingOrder(
    {
      quoteId: quote.id,
      items,
      wallet: { walletId: wallet.id, provider: wallet.walletType, network: wallet.network },
      collector: { username: 'ana', displayName: 'Ana Costa', email: 'ana@kurio.test' },
    },
    'user-ana',
    quote,
    wallet,
    Date.now(),
  );
}

describe('compatibilidade do recibo persistido', () => {
  it('aceita o pedido antigo sem coletor e token, preservando valores e edições', () => {
    const order = currentOrder();
    const stored = JSON.stringify({
      ...order,
      collector: undefined,
      items: order.items.map((item) => ({ ...item, tokenId: undefined })),
    });
    const parsed = orderSchema.parse(JSON.parse(stored));
    expect(parsed).not.toHaveProperty('collector');
    expect(parsed.items[0]).not.toHaveProperty('tokenId');
    expect(parsed.items[0]?.editionLabel).toBe(order.items[0]?.editionLabel);
    expect(parsed.total).toBe(order.total);
    expect(parsed.wallet).toEqual(order.wallet);
  });
});
