import { describe, expect, it } from 'vitest';

import type { Order } from '@/contracts/order';
import { createSeed } from '@/mocks/db/seed';

import { computeQuote } from './pricing';
import { applyDueTransitions, scheduleOrderTransition } from './timing';

function createOrder(): Order {
  const quote = computeQuote(createSeed(), {
    items: [{ nftId: 'nft-001', editionId: 'nft-001-10', quantity: 1 }],
    network: 'ethereum',
  });
  return {
    ...quote,
    id: 'order-1',
    userId: 'user-ana',
    status: 'pending',
    wallet: {
      provider: 'metamask',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      network: 'ethereum',
    },
    transactionRef: '',
    explorerUrl: '',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
}

describe('transições de pedidos', () => {
  it('aplica somente transições vencidas, reduz estoque uma vez e não regride estados terminais', () => {
    const order = createOrder();
    const state = { ...createSeed(), orders: [order] };
    const scheduled = scheduleOrderTransition(state, order.id, 'confirmed', 3000);
    expect(applyDueTransitions(scheduled, 2000).orders[0]?.status).toBe('pending');
    const confirmed = applyDueTransitions(scheduled, 4000);
    expect(confirmed.orders[0]).toMatchObject({ status: 'confirmed', version: order.version + 1 });
    expect(confirmed.nfts[0]?.editions[0]?.available).toBe(9);
    expect(applyDueTransitions(confirmed, 5000).nfts[0]?.editions[0]?.available).toBe(9);
  });
});
