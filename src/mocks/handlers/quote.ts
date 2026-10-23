import { http, HttpResponse } from 'msw';

import { quoteInputSchema } from '@/contracts/quote';
import { getScenario } from '@/mocks/scenarios/current';
import { withNetwork } from '@/mocks/scenarios/network';
import { MockError } from '@/mocks/shared/respond';
import { scheduleCheckoutChange } from '@/mocks/shared/scheduleCheckoutChange';
import { storeQuote } from '@/mocks/shared/storeQuote';

export const quoteHandlers = [
  http.post(
    '*/api/quote',
    withNetwork(async ({ request }) => {
      const input = quoteInputSchema.parse(await request.json());
      if (input.couponCode && getScenario().name === 'coupon-expired')
        throw new MockError(422, 'COUPON_EXPIRED');
      const quote = storeQuote(input);
      if (request.headers.get('X-Quote-Context') === 'checkout') scheduleCheckoutChange(input);
      return HttpResponse.json(quote);
    }),
  ),
];
