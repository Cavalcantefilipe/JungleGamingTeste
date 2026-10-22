import { describe, expect, it } from 'vitest';

import { nftSchema } from './nft';
import { orderSchema } from './order';
import { realtimeEventSchema } from './realtime';
import { walletInputSchema } from './wallet';

const validNft = {
  id: 'nft_001',
  slug: 'emerald-ape-042',
  name: 'Emerald Ape #042',
  tokenId: '#0042',
  collection: 'Kurio Apes',
  category: 'arte-digital',
  network: 'ethereum',
  price: '1.19',
  rating: { average: 4.8, count: 19 },
  description: 'Um colecionável digital 1/50.',
  attributes: [{ label: 'Óculos', value: 'Esmeralda' }],
  images: [
    { src: '/images/nfts/emerald-ape.webp', alt: 'Emerald Ape #042', width: 600, height: 600 },
  ],
  editions: [{ id: 'ed_1_50', label: '1/50', available: 12, max: 50 }],
  badges: ['featured'],
  listedAt: '2026-07-01T12:00:00.000Z',
  version: 1,
};

describe('contratos', () => {
  it('nftSchema aceita fixture válida', () => {
    expect(nftSchema.safeParse(validNft).success).toBe(true);
  });

  it('nftSchema rejeita preço numérico', () => {
    expect(nftSchema.safeParse({ ...validNft, price: 1.19 }).success).toBe(false);
  });

  it('orderSchema rejeita status desconhecido', () => {
    const result = orderSchema.safeParse({
      id: 'ord_1',
      userId: 'usr_1',
      status: 'shipped',
      items: [],
      subtotal: '0',
      discount: '0',
      networkFee: '0',
      total: '0',
      wallet: { provider: 'metamask', address: '0x' + 'a'.repeat(40), network: 'ethereum' },
      transactionRef: '0xA91F',
      explorerUrl: 'https://etherscan.io/tx/0xA91F',
      createdAt: '2026-07-29T12:00:00.000Z',
      updatedAt: '2026-07-29T12:00:00.000Z',
      version: 1,
    });

    expect(result.success).toBe(false);
  });

  it('realtimeEventSchema discrimina por type', () => {
    const event = realtimeEventSchema.parse({
      id: '9b2d1a2e-3c4f-4a5b-8c6d-7e8f9a0b1c2d',
      type: 'order.updated',
      resource: { kind: 'order', id: 'ord_1' },
      version: 2,
      occurredAt: '2026-07-29T12:00:05.000Z',
      payload: { status: 'confirmed' },
    });

    expect(event.type).toBe('order.updated');
    expect(
      realtimeEventSchema.safeParse({
        id: '9b2d1a2e-3c4f-4a5b-8c6d-7e8f9a0b1c2d',
        type: 'nft.updated',
        resource: { kind: 'order', id: 'x' },
        version: 1,
        occurredAt: '2026-07-29T12:00:05.000Z',
        payload: {},
      }).success,
    ).toBe(false);
  });

  it('walletInputSchema valida o endereço conforme a rede', () => {
    const base = {
      displayName: 'Ana',
      walletNickname: 'Reserva',
      profileName: 'ana',
      walletType: 'metamask',
      email: 'ana@kurio.test',
      ensName: 'ana',
    };

    expect(
      walletInputSchema.safeParse({ ...base, network: 'ethereum', address: '0x' + 'a'.repeat(40) })
        .success,
    ).toBe(true);
    expect(
      walletInputSchema.safeParse({ ...base, network: 'solana', address: '0x' + 'a'.repeat(40) })
        .success,
    ).toBe(false);
  });
});
