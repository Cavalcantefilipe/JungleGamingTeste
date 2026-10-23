import { http, HttpResponse } from 'msw';

import { quoteInputSchema } from '@/contracts/quote';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';
import { withNetwork } from '@/mocks/scenarios/network';
import { computeQuote } from '@/mocks/shared/pricing';
import { MockError } from '@/mocks/shared/respond';
import { scheduleCheckoutChange } from '@/mocks/shared/scheduleCheckoutChange';

export const quoteHandlers = [
  http.post(
    '*/api/quote',
    withNetwork(async ({ request }) => {
      const input = quoteInputSchema.parse(await request.json());
      if (input.couponCode && getScenario().name === 'coupon-expired')
        throw new MockError(422, 'COUPON_EXPIRED');
      const quote = computeQuote(mockStore.read(), input);
      mockStore.write((db) => ({ ...db, quotes: { ...db.quotes, [quote.id]: quote } }));
      if (request.headers.get('X-Quote-Context') === 'checkout') scheduleCheckoutChange(input);
      return HttpResponse.json(quote);
    }),
  ),
];
