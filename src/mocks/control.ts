import { mockStore } from './db/store';
import {
  getScenario,
  setNetwork as configureNetwork,
  setScenario as selectScenario,
} from './scenarios/current';
import { reconcileOrders } from './shared/orders';
import { scheduleOrderTransition } from './shared/timing';
import { emitMockEvent } from './socket/events';
import { realtimeServer } from './socket/server';

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
