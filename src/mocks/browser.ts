import { setupWorker } from 'msw/browser';

import { env } from '@/lib/env';

import { installMockControl } from './control';
import { createMockStore } from './db/store';
import { createHandlers, noopEventPublisher } from './handlers';
import { resolveInitialScenario, setScenario } from './scenarios/current';
import { SCENARIOS } from './scenarios/registry';

export async function startMocks(): Promise<void> {
  if (!env.enableMocks) return;
  const scenario = setScenario(resolveInitialScenario(window.location.search, env.mockScenario));
  const clock = () => new Date();
  const store = createMockStore({ seedName: SCENARIOS[scenario.name].seed, clock });
  await store.init();

  const worker = setupWorker(
    ...createHandlers({ store, clock, baseUrl: env.apiBaseUrl, events: noopEventPublisher }),
  );
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: !import.meta.env.DEV,
    serviceWorker: { url: '/mockServiceWorker.js' },
  });

  installMockControl({
    store,
    clock,
    emit: () => {
      console.warn('Eventos de tempo real ainda não estão disponíveis nesta versão');
    },
    publishOrderUpdated: noopEventPublisher.publishOrderUpdated,
  });
}
