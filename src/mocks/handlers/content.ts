import { http, HttpResponse } from 'msw';

import { content } from '@/mocks/db/fixtures/content';
import { withNetwork } from '@/mocks/scenarios/network';

export const contentHandlers = [
  http.get(
    '*/api/content',
    withNetwork(() => HttpResponse.json(content)),
  ),
];
