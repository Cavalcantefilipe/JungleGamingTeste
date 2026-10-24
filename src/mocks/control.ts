import { mockStore } from '@/mocks/db/store';
import {
  getScenario,
  setNetwork as configureNetwork,
  setScenario as selectScenario,
} from '@/mocks/scenarios/current';
import { reconcileOrders } from '@/mocks/shared/orders';
import { scheduleOrderTransition } from '@/mocks/shared/timing';
import { emitMockEvent } from '@/mocks/socket/events';
import { realtimeServer } from '@/mocks/socket/server';

export const mockControl = {
  reset(seed = 'default') {
    mockStore.reset(seed);
  },
  setScenario(name: string) {
    selectScenario(name);
    if (getScenario().network.offline) realtimeServer.disconnect();
    else realtimeServer.reconnect();
  },
  emit: emitMockEvent,
  disconnectSocket: () => {
    realtimeServer.disconnect();
  },
  reconnectSocket: () => {
    realtimeServer.reconnect();
  },
  getConnections: () => realtimeServer.connectedUsers(),
  advanceOrder(orderId: string, status: 'confirmed' | 'declined') {
    mockStore.write((db) => scheduleOrderTransition(db, orderId, status, 0));
    reconcileOrders();
  },
  setNetwork(network: Parameters<typeof configureNetwork>[0]) {
    configureNetwork(network);
    if (getScenario().network.offline) realtimeServer.disconnect();
    else realtimeServer.reconnect();
  },
  getState: () => mockStore.read(),
  getScenario,
};
declare global {
  interface Window {
    __kurio: typeof mockControl;
  }
}
