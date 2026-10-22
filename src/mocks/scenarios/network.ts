import {
  delay,
  HttpResponse,
  type DefaultBodyType,
  type HttpResponseResolver,
  type PathParams,
} from 'msw';

import { getScenario } from './current';
import { respondError } from '../shared/respond';

import type { ApiErrorBody } from '@/contracts';

const PRNG_MULTIPLIER = 1664525;
const PRNG_INCREMENT = 1013904223;
const PRNG_MODULUS = 2 ** 32;

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (PRNG_MULTIPLIER * state + PRNG_INCREMENT) % PRNG_MODULUS;
    return state / PRNG_MODULUS;
  };
}

const random = createSeededRandom(20_261_022);

export function nextLatencyMs(): number {
  const { latencyMs, jitterMs } = getScenario().network;
  return Math.max(0, Math.round(latencyMs + (random() * 2 - 1) * jitterMs));
}

export function withNetwork<
  Params extends PathParams,
  RequestBody extends DefaultBodyType,
  ResponseBody extends DefaultBodyType,
>(
  resolver: HttpResponseResolver<Params, RequestBody, ResponseBody>,
): HttpResponseResolver<Params, RequestBody, ResponseBody | ApiErrorBody> {
  return async (info) => {
    const { network, flags } = getScenario();
    if (network.offline) {
      return HttpResponse.error();
    }
    await delay(nextLatencyMs());
    if (network.failRate > 0 && random() < network.failRate) {
      return respondError(503, 'TRANSIENT', 'Falha temporária, tente novamente');
    }
    if (flags.readsFail && info.request.method === 'GET') {
      return respondError(500, 'TRANSIENT', 'Erro interno simulado');
    }
    return resolver(info);
  };
}
