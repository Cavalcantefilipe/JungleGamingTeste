import { describe, expect, it } from 'vitest';

import { computeQuote } from './pricing';
import { applyDueTransitions, scheduleOrderTransition } from './timing';
import { createNftFixture } from '../db/fixtures/nfts';
import { buildEmptyDb } from '../db/seed';

import type { Order } from '@/contracts';

const now = new Date('2026-07-29T12:00:00.000Z');

function buildOrder(id: string): Order {
  const nft = createNftFixture(0, { id: 'nft_a' });
  const quoted = computeQuote(
    { ...buildEmptyDb(), nfts: [nft] },
    {
      items: [{ nftId: 'nft_a', editionId: nft.editions[0]?.id ?? '', quantity: 1 }],
      network: 'ethereum',
    },
    now,
  );
  if (!quoted.ok) throw new Error('cotação inválida no teste');
  return {
    id,
    userId: 'usr_ana',
    status: 'pending',
    items: quoted.quote.items,
    subtotal: quoted.quote.subtotal,
    discount: quoted.quote.discount,
    networkFee: quoted.quote.networkFee,
    total: quoted.quote.total,
    wallet: { provider: 'metamask', address: `0x${'a'.repeat(40)}`, network: 'ethereum' },
    transactionRef: '0xA91F',
    explorerUrl: 'https://etherscan.io/tx/0xA91F',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    version: 1,
  };
}

describe('transições agendadas de pedido', () => {
  it('aplica só as transições vencidas e incrementa a versão', () => {
    const db = { ...buildEmptyDb(), orders: [buildOrder('ord_1'), buildOrder('ord_2')] };
    const scheduled = scheduleOrderTransition(
      scheduleOrderTransition(db, {
        orderId: 'ord_1',
        status: 'confirmed',
        dueAt: '2026-07-29T12:00:03.000Z',
      }),
      {
        orderId: 'ord_2',
        status: 'declined',
        dueAt: '2026-07-29T12:00:10.000Z',
        declineReason: 'x',
      },
    );

    const { db: next, applied } = applyDueTransitions(
      scheduled,
      new Date('2026-07-29T12:00:05.000Z'),
    );

    expect(applied.map((order) => order.id)).toEqual(['ord_1']);
    expect(next.orders.find((order) => order.id === 'ord_1')).toMatchObject({
      status: 'confirmed',
      version: 2,
      updatedAt: '2026-07-29T12:00:05.000Z',
    });
    expect(next.orders.find((order) => order.id === 'ord_2')?.status).toBe('pending');
    expect(next.scheduledTransitions).toHaveLength(1);
  });
});
