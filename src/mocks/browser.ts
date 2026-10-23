import { setupWorker } from 'msw/browser';

import { env } from '@/lib/env';

import { mockControl } from './control';
import { mockStore } from './db/store';
import { handlers } from './handlers';
import { getScenario, setScenario } from './scenarios/current';
import { SCENARIO_NAMES } from './scenarios/registry';

export async function startMocks(): Promise<void> {
  const name =
    new URLSearchParams(location.search).get('scenario') ??
    localStorage.getItem('kurio.scenario') ??
    env.mockScenario;
  setScenario(SCENARIO_NAMES.find((scenario) => scenario === name) ?? 'default');
  if (getScenario().seed === 'empty') mockStore.reset('empty');
  window.__kurio = mockControl;
  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });
}
