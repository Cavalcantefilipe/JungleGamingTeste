import { mockStore } from './db/store';
import { getScenario, setNetwork, setScenario } from './scenarios/current';

export const mockControl = {
  reset(seed = 'default') {
    mockStore.reset(seed);
  },
  setScenario,
  setNetwork,
  getState: () => mockStore.read(),
  getScenario,
};
declare global {
  interface Window {
    __kurio: typeof mockControl;
  }
}
