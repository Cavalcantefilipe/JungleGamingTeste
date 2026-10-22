import { setNetwork, setScenario } from './scenarios/current';
import {
  SCENARIO_NAMES,
  type NetworkConditions,
  type Scenario,
  type ScenarioName,
} from './scenarios/registry';
import { settleOrders } from './shared/orders';
import { scheduleOrderTransition } from './shared/timing';

import type { MockDb, SeedName } from './db/schema';
import type { MockStore } from './db/store';
import type { RealtimeServer } from './socket/server';
import type { Nft, Order, OrderStatus, RealtimeEvent } from '@/contracts';

export interface KurioMockControl {
  reset(seed?: SeedName): Promise<void>;
  setScenario(name: ScenarioName): Promise<Scenario>;
  setNetwork(override: Partial<NetworkConditions>): NetworkConditions;
  emit(event: RealtimeEvent): void;
  getState(): MockDb;
  advanceOrder(orderId: string, status: OrderStatus): Order | undefined;
  updateNft(nftId: string, patch: Partial<Nft>): Nft | undefined;
  realtimeConnections(): number;
  disconnectRealtime(): void;
  listScenarios(): readonly ScenarioName[];
}

declare global {
  interface Window {
    __kurio?: KurioMockControl;
  }
}

export interface MockControlDependencies {
  store: MockStore;
  initialSeed: SeedName;
  clock: () => Date;
  realtime: RealtimeServer;
  publishOrderUpdated: (order: Order) => void;
}

export function installMockControl(deps: MockControlDependencies): KurioMockControl {
  let currentSeed: SeedName = deps.initialSeed;
  const control: KurioMockControl = {
    async reset(seed = currentSeed) {
      currentSeed = seed;
      await deps.store.reset(seed);
    },
    async setScenario(name) {
      const scenario = setScenario(name);
      if (scenario.seed !== currentSeed) await control.reset(scenario.seed);
      return scenario;
    },
    setNetwork,
    emit: deps.realtime.broadcast,
    getState: () => deps.store.read(),
    advanceOrder(orderId, status) {
      const now = deps.clock();
      const scheduled = scheduleOrderTransition(deps.store.read(), {
        orderId,
        status,
        dueAt: now.toISOString(),
        ...(status === 'declined'
          ? { declineReason: 'Recusado manualmente pelo painel de mocks' }
          : {}),
      });
      const { db, applied } = settleOrders(scheduled, now);
      deps.store.write(() => db);
      applied.forEach(deps.publishOrderUpdated);
      return applied.find((order) => order.id === orderId);
    },
    updateNft(nftId, patch) {
      const db = deps.store.write((current) => ({
        ...current,
        nfts: current.nfts.map((nft) =>
          nft.id === nftId ? { ...nft, ...patch, version: nft.version + 1 } : nft,
        ),
      }));
      return db.nfts.find((nft) => nft.id === nftId);
    },
    realtimeConnections: deps.realtime.connectedCount,
    disconnectRealtime: deps.realtime.disconnectAll,
    listScenarios: () => SCENARIO_NAMES,
  };
  window.__kurio = control;
  return control;
}
