import { delay, HttpResponse, type HttpResponseResolver } from 'msw';
import { ZodError } from 'zod';

import { getScenario } from '@/mocks/scenarios/current';
import { MockError, respondError } from '@/mocks/shared/respond';

let sequence = 0;

export function withNetwork(resolver: HttpResponseResolver): HttpResponseResolver {
  return async (info) => {
    const scenario = getScenario();
    const position = ++sequence;
    const jitter = ((position * 9301 + 49297) % 233280) / 233280;
    const latency =
      scenario.name === 'out-of-order'
        ? 100 + jitter * 1400
        : scenario.network.latencyMs + (jitter - 0.5) * 2 * scenario.network.jitterMs;
    await delay(Math.max(0, latency));
    if (scenario.network.offline || jitter < scenario.network.failRate) return HttpResponse.error();
    if (scenario.name === 'server-error-reads' && info.request.method === 'GET')
      return respondError(500, 'TRANSIENT');
    try {
      return await resolver(info);
    } catch (error) {
      if (error instanceof MockError)
        return respondError(error.status, error.code, error.message, error.fields);
      if (error instanceof ZodError)
        return respondError(
          422,
          'VALIDATION',
          'Dados inválidos',
          Object.fromEntries(error.issues.map((issue) => [issue.path.join('.'), issue.message])),
        );
      if (error instanceof SyntaxError) return respondError(422, 'VALIDATION', 'JSON inválido');
      console.error('Falha no mock', error);
      return respondError(500, 'INTERNAL');
    }
  };
}
