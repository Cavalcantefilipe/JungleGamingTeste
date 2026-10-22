import { quoteInputSchema, type Quote, type QuoteInput, type QuoteItem } from '@/contracts/quote';
import { addEth, mulEth, percentOf, subEth } from '@/lib/money';
import { coupons } from '@/mocks/db/fixtures/coupons';
import type { MockDb } from '@/mocks/db/schema';

import { MockError } from './respond';

export function priceItem(db: MockDb, item: QuoteInput['items'][number]): QuoteItem {
  const nft = db.nfts.find((entry) => entry.id === item.nftId);
  const edition = nft?.editions.find((entry) => entry.id === item.editionId);
  const image = nft?.images[0];
  if (!nft || !edition || !image) throw new MockError(404, 'NOT_FOUND');
  if (item.quantity > edition.available)
    throw new MockError(409, 'UNAVAILABLE', { quantity: `Disponível: ${edition.available}` });
  return {
    ...item,
    unitPrice: nft.price,
    lineTotal: mulEth(nft.price, item.quantity),
    available: edition.available,
    name: nft.name,
    editionLabel: edition.label,
    image,
  };
}

export function computeQuote(db: MockDb, input: QuoteInput): Quote {
  input = quoteInputSchema.parse(input);
  const items = input.items.map((item) => priceItem(db, item));
  const subtotal = items.reduce((sum, item) => addEth(sum, item.lineTotal), '0');
  const coupon = coupons.find((entry) => entry.code === input.couponCode);
  if (input.couponCode && !coupon)
    throw new MockError(422, 'COUPON_INVALID', { couponCode: 'Cupom inválido' });
  if (coupon?.expired)
    throw new MockError(422, 'COUPON_EXPIRED', { couponCode: 'Este cupom expirou' });
  const discount = coupon ? percentOf(subtotal, coupon.percent) : '0';
  const networkFee = { ethereum: '0.016', polygon: '0.002', solana: '0.0005' }[input.network];
  return {
    id: crypto.randomUUID(),
    items,
    subtotal,
    discount,
    networkFee,
    total: addEth(subEth(subtotal, discount), networkFee),
    network: input.network,
    version: items.reduce(
      (sum, item) => sum + (db.nfts.find((nft) => nft.id === item.nftId)?.version ?? 0),
      0,
    ),
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    ...(coupon
      ? { coupon: { code: coupon.code, status: 'applied' as const, percent: coupon.percent } }
      : {}),
  };
}
