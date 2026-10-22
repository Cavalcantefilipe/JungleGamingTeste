import { addEth, mulEth, percentOf, subEth } from '@/lib/money';

import { failure, type MockFailure, type MockResult } from './respond';
import { resolveCoupon } from '../db/fixtures/coupons';

import type { MockDb } from '../db/schema';
import type { EthAmount, NftNetwork, Quote, QuoteInput, QuoteItem } from '@/contracts';

export const NETWORK_FEES: Record<NftNetwork, EthAmount> = {
  ethereum: '0.016',
  polygon: '0.002',
  solana: '0.0005',
};

export const QUOTE_TTL_MS = 10 * 60 * 1000;

export type QuoteResult = { ok: true; quote: Quote } | MockFailure;

function quoteItems(db: MockDb, input: QuoteInput): MockResult<QuoteItem[]> {
  const items: QuoteItem[] = [];
  const unavailable: Record<string, string> = {};
  for (const requested of input.items) {
    const nft = db.nfts.find((candidate) => candidate.id === requested.nftId);
    const edition = nft?.editions.find((candidate) => candidate.id === requested.editionId);
    if (!nft || !edition) {
      return failure(404, { code: 'NOT_FOUND', message: `NFT ${requested.nftId} não encontrado` });
    }
    if (edition.available < requested.quantity) {
      unavailable[nft.id] = String(edition.available);
    }
    const image = nft.images[0];
    if (!image) {
      return failure(404, { code: 'NOT_FOUND', message: `NFT ${requested.nftId} sem imagem` });
    }
    items.push({
      nftId: nft.id,
      editionId: edition.id,
      quantity: requested.quantity,
      unitPrice: nft.price,
      lineTotal: mulEth(nft.price, requested.quantity),
      available: edition.available,
      name: nft.name,
      editionLabel: edition.label,
      image,
    });
  }
  if (Object.keys(unavailable).length > 0) {
    return failure(409, {
      code: 'UNAVAILABLE',
      message: 'Alguns itens não têm a quantidade disponível',
      fields: unavailable,
    });
  }
  return { ok: true, value: items };
}

export function computeQuote(db: MockDb, input: QuoteInput, now: Date): QuoteResult {
  const itemsResult = quoteItems(db, input);
  if (!itemsResult.ok) return itemsResult;
  const items = itemsResult.value;

  const subtotal = items.reduce<EthAmount>((sum, item) => addEth(sum, item.lineTotal), '0');
  const coupon = input.couponCode ? resolveCoupon(input.couponCode, now) : undefined;
  if (coupon?.status === 'expired') {
    return failure(422, { code: 'COUPON_EXPIRED', message: 'Este cupom expirou' });
  }
  if (coupon?.status === 'invalid') {
    return failure(422, { code: 'COUPON_INVALID', message: 'Cupom inválido' });
  }
  const discount = coupon?.percent ? percentOf(subtotal, coupon.percent) : '0';
  const networkFee = NETWORK_FEES[input.network];
  const total = addEth(subEth(subtotal, discount), networkFee);
  const version = Math.max(
    0,
    ...items.map((item) => db.nfts.find((nft) => nft.id === item.nftId)?.version ?? 0),
  );

  return {
    ok: true,
    quote: {
      id: `qt_${crypto.randomUUID()}`,
      items,
      subtotal,
      discount,
      networkFee,
      total,
      ...(coupon ? { coupon } : {}),
      network: input.network,
      version,
      expiresAt: new Date(now.getTime() + QUOTE_TTL_MS).toISOString(),
    },
  };
}
