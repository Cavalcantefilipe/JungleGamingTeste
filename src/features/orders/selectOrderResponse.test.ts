import { describe, expect, it } from 'vitest';

import { orderSchema } from '@/contracts/order';
import { selectOrderResponse } from '@/features/orders/selectOrderResponse';
import { createSeed } from '@/mocks/db/seed';
import { computeQuote } from '@/mocks/shared/pricing';

function pendingOrder() {
  const seed = createSeed();
  const nft = seed.nfts[0];
  const edition = nft?.editions[0];
  const wallet = seed.wallets['user-ana']?.primary;
  if (!nft || !edition || !wallet) throw new Error('Fixture ausente');
  const quote = computeQuote(seed, {
    items: [{ nftId: nft.id, editionId: edition.id, quantity: 1 }],
    network: wallet.network,
  });
  return orderSchema.parse({
    ...quote,
    id: 'order-a',
    userId: 'user-ana',
    status: 'pending',
    transactionRef: 'pending',
    explorerUrl: 'pending',
    wallet: { provider: wallet.walletType, address: wallet.address, network: wallet.network },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  });
}

describe('resposta atrasada de criação', () => {
  it('ACK pendente não substitui recibo já confirmado', () => {
    const pending = pendingOrder();
    const confirmed = { ...pending, status: 'confirmed' as const, version: 2 };
    expect(selectOrderResponse(confirmed, pending)).toBe(confirmed);
    expect(selectOrderResponse(confirmed, { ...pending, version: 3 })).toBe(confirmed);
  });
  it('adota confirmação mais recente e rejeita resposta de versão anterior', () => {
    const pending = pendingOrder();
    const confirmed = { ...pending, status: 'confirmed' as const, version: 2 };
    expect(selectOrderResponse(pending, confirmed)).toBe(confirmed);
    const newerPending = { ...pending, version: 3 };
    expect(selectOrderResponse(newerPending, pending)).toBe(newerPending);
  });
});
