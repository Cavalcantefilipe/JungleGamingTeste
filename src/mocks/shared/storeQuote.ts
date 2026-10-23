import type { QuoteInput } from '@/contracts/quote';
import { mockStore } from '@/mocks/db/store';

import { computeQuote } from './pricing';

export function storeQuote(input: QuoteInput) {
  return mockStore.transaction((db) => {
    const now = Date.now();
    const quote = computeQuote(db, input);
    const active = Object.fromEntries(
      Object.entries(db.quotes).filter(([, entry]) => Date.parse(entry.expiresAt) > now),
    );
    return {
      state: { ...db, quotes: { ...active, [quote.id]: quote } },
      result: quote,
    };
  });
}
