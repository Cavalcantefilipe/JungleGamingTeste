import { setupWorker } from 'msw/browser';

import { env } from '@/lib/env';

import { installMockControl } from './control';
import { createMockStore } from './db/store';
import { createHandlers } from './handlers';
import { resolveInitialScenario, setScenario } from './scenarios/current';
import { SCENARIOS } from './scenarios/registry';
import { createEventPublisher } from './socket/events';
import { createRealtimeServer } from './socket/server';
import { startSettlementTicker } from './socket/ticker';

export async function startMocks(): Promise<void> {
  if (!env.enableMocks) return;
  const scenario = setScenario(resolveInitialScenario(window.location.search, env.mockScenario));
  const clock = () => new Date();
  const store = createMockStore({ seedName: SCENARIOS[scenario.name].seed, clock });
  await store.init();

  const realtime = createRealtimeServer(
    env.socketUrl,
    (token) => store.read().sessions.find((session) => session.token === token)?.userId ?? null,
  );
  const events = createEventPublisher(realtime, clock);
  const worker = setupWorker(
    ...createHandlers({ store, clock, baseUrl: env.apiBaseUrl, events }),
    ...realtime.handlers,
  );
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: !import.meta.env.DEV,
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
  startSettlementTicker({ store, clock, events });

  installMockControl({
    store,
    initialSeed: scenario.seed,
    clock,
    realtime,
    publishOrderUpdated: events.publishOrderUpdated,
  });
}
