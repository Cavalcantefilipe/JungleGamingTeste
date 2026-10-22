import { http, HttpResponse } from 'msw';

import { quoteInputSchema, type Nft } from '@/contracts';
import { mulEth } from '@/lib/money';

import { route, type HandlerContext } from './context';
import { consumeFlag } from '../scenarios/current';
import { withNetwork } from '../scenarios/network';
import { computeQuote } from '../shared/pricing';
import { readJsonBody, respondFailure } from '../shared/respond';

import type { MockDb } from '../db/schema';

const PRICE_BUMP_PERCENT = 1.1;

function bumpPrice(nft: Nft): Nft {
  return { ...nft, price: mulEth(nft.price, PRICE_BUMP_PERCENT), version: nft.version + 1 };
}

function sellOut(nft: Nft, editionId: string): Nft {
  return {
    ...nft,
    version: nft.version + 1,
    editions: nft.editions.map((edition) =>
      edition.id === editionId ? { ...edition, available: 0 } : edition,
    ),
  };
}

function applyCheckoutScenario(
  context: HandlerContext,
  firstItem: { nftId: string; editionId: string },
) {
  const priceChanges = consumeFlag('priceChangesAfterQuote');
  const sellsOut = consumeFlag('editionSellsOutAfterQuote');
  if (!priceChanges && !sellsOut) return;
  let changed: Nft | undefined;
  context.store.write((db: MockDb) => ({
    ...db,
    nfts: db.nfts.map((nft) => {
      if (nft.id !== firstItem.nftId) return nft;
      changed = priceChanges ? bumpPrice(nft) : sellOut(nft, firstItem.editionId);
      return changed;
    }),
  }));
  if (changed) context.events.publishNftUpdated(changed);
}

export function quoteHandlers(context: HandlerContext) {
  return [
    http.post(
      route(context, '/quote'),
      withNetwork(async ({ request }) => {
        const body = await readJsonBody(request, quoteInputSchema);
        if (!body.ok) return respondFailure(body);
        const result = computeQuote(context.store.read(), body.value, context.clock());
        if (!result.ok) return respondFailure(result);
        const { quote } = result;
        context.store.write((db) => ({
          ...db,
          quotes: [...db.quotes.slice(-49), { ...quote, createdAt: context.clock().toISOString() }],
        }));
        const firstItem = body.value.items[0];
        if (firstItem) applyCheckoutScenario(context, firstItem);
        return HttpResponse.json(quote);
      }),
    ),
  ];
}
