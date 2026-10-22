import { test as base, expect, type Page } from '@playwright/test';

import type { NftUpdatedEvent, RealtimeEvent } from '../../src/contracts';
import type { KurioMockControl } from '../../src/mocks/control';
import type { NetworkConditions, ScenarioName } from '../../src/mocks/scenarios/registry';

export const SEED_USERS = {
  ana: { email: 'ana@kurio.test', password: 'Kurio!2026', displayName: 'Ana Ribeiro' },
  bruno: { email: 'bruno@kurio.test', password: 'Kurio!2026', displayName: 'Bruno Lima' },
} as const;

export type SeedUser = keyof typeof SEED_USERS;

export interface KurioHelpers {
  setScenario(name: ScenarioName, options?: { reload?: boolean }): Promise<void>;
  setNetwork(override: Partial<NetworkConditions>): Promise<void>;
  emit(event: RealtimeEvent): Promise<void>;
  getState(): Promise<ReturnType<KurioMockControl['getState']>>;
  loginAs(user: SeedUser): Promise<void>;
  reload(): Promise<void>;
  nftEvent(nftId: string, version: number, payload: NftUpdatedEvent['payload']): NftUpdatedEvent;
}

async function waitForMocks(page: Page): Promise<void> {
  await page.waitForFunction(() => window.__kurio !== undefined);
}

async function resetBrowserState(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await waitForMocks(page);
}

export const test = base.extend<{ kurio: KurioHelpers }>({
  kurio: [
    async ({ page }, use) => {
      await resetBrowserState(page);
      const helpers: KurioHelpers = {
        async setScenario(name, options = {}) {
          await page.evaluate(async (scenario) => {
            await window.__kurio?.setScenario(scenario);
          }, name);
          if (options.reload) {
            await page.reload();
            await waitForMocks(page);
          }
        },
        async setNetwork(override) {
          await page.evaluate((conditions) => {
            window.__kurio?.setNetwork(conditions);
          }, override);
        },
        async emit(event) {
          await page.evaluate((payload) => {
            window.__kurio?.emit(payload);
          }, event);
        },
        async getState() {
          return page.evaluate(() => {
            const control = window.__kurio;
            if (!control) throw new Error('mocks indisponíveis');
            return control.getState();
          });
        },
        async loginAs(user) {
          const credentials = SEED_USERS[user];
          await page.evaluate(async ({ email, password }) => {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            if (!response.ok) throw new Error(`login falhou: ${response.status}`);
            localStorage.setItem('kurio.session', JSON.stringify(await response.json()));
          }, credentials);
          await page.reload();
          await waitForMocks(page);
        },
        async reload() {
          await page.reload();
          await waitForMocks(page);
        },
        nftEvent(nftId, version, payload) {
          return {
            id: crypto.randomUUID(),
            type: 'nft.updated',
            resource: { kind: 'nft', id: nftId },
            version,
            occurredAt: new Date().toISOString(),
            payload,
          };
        },
      };
      await use(helpers);
    },
    { auto: true },
  ],
});

export { expect };
