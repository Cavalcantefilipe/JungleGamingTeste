import { delay, http, HttpResponse } from 'msw';

import { createOrderInputSchema } from '@/contracts/order';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';
import { withNetwork } from '@/mocks/scenarios/network';
import { createOrder, reconcileOrders } from '@/mocks/shared/orders';
import { MockError } from '@/mocks/shared/respond';
import { requireSession } from '@/mocks/shared/session';

export const orderHandlers = [
  http.post(
    '*/api/orders',
    withNetwork(async ({ request }) => {
      const { user, session } = requireSession(request);
      const input = createOrderInputSchema.parse(await request.json());
      const result = await createOrder(
        input,
        user.id,
        session.token,
        request.headers.get('Idempotency-Key') ?? '',
      );
      if (!result.repeated && getScenario().name === 'order-timeout') await delay(12_000);
      return HttpResponse.json(result.order, { status: result.repeated ? 200 : 201 });
    }),
  ),
  http.get(
    '*/api/orders/:id',
    withNetwork(({ request, params }) => {
      const { user } = requireSession(request);
      reconcileOrders();
      const order = mockStore.read().orders.find((entry) => entry.id === params.id);
      if (!order) throw new MockError(404, 'NOT_FOUND');
      if (order.userId !== user.id) throw new MockError(403, 'FORBIDDEN');
      return HttpResponse.json(order);
    }),
  ),
];
