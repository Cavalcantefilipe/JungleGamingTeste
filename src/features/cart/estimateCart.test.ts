import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { quoteQueryOptions } from '@/features/checkout/quote';
import { createSeed } from '@/mocks/db/seed';
import { computeQuote } from '@/mocks/shared/pricing';

import { estimateCart } from './estimateCart';

const items = [{ nftId: 'nft-001', editionId: 'nft-001-10', quantity: 1 }];
const input = { items, network: 'ethereum' as const, couponCode: 'LANCAMENTO10' };
const scope = { kind: 'user' as const, id: 'user-ana' };
const baseline = computeQuote(createSeed(), input);

describe('estimativa de apresentação do carrinho', () => {
  it('reutiliza preço, taxa e percentual da API com precisão decimal, sem produzir id de cotação', () => {
    const estimate = estimateCart(
      [{ ...items[0], nftId: 'nft-001', editionId: 'nft-001-10', quantity: 2 }],
      baseline,
    );
    expect(estimate).toMatchObject({
      subtotal: '2.38',
      discount: '0.238',
      networkFee: '0.016',
      total: '2.158',
    });
    expect(estimate).not.toHaveProperty('id');
  });
  it('aguarda a API quando não conhece o preço da edição', () => {
    expect(estimateCart(items, undefined)).toBeUndefined();
    expect(
      estimateCart([{ nftId: 'novo', editionId: 'nova', quantity: 1 }], baseline),
    ).toBeUndefined();
  });
  it.each(['user', 'coupon', 'network'])(
    'placeholder não reutiliza dados ao mudar %s',
    (change) => {
      const client = new QueryClient();
      const initial = quoteQueryOptions(input, scope);
      client.setQueryData(initial.queryKey, baseline);
      const observer = new QueryObserver(client, { ...initial, enabled: false });
      const unsubscribe = observer.subscribe(() => undefined);
      const updated = { ...input, items: items.map((item) => ({ ...item, quantity: 2 })) };
      observer.setOptions({ ...quoteQueryOptions(updated, scope), enabled: false });
      expect(observer.getCurrentResult().isPlaceholderData).toBe(true);
      observer.setOptions({
        ...quoteQueryOptions(
          {
            ...updated,
            ...(change === 'coupon' ? { couponCode: 'OUTRO' } : {}),
            ...(change === 'network' ? { network: 'polygon' as const } : {}),
          },
          change === 'user' ? { ...scope, id: 'user-bruno' } : scope,
        ),
        enabled: false,
      });
      expect(observer.getCurrentResult().data).toBeUndefined();
      unsubscribe();
      client.clear();
    },
  );
});
