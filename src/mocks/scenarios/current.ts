import { registry } from './registry';

let currentName = 'default';
let networkOverrides: Partial<{
  latencyMs: number;
  jitterMs: number;
  failRate: number;
  offline: boolean;
}> = {};

export function setScenario(name: string): void {
  if (!registry[name]) throw new Error(`Cenário desconhecido: ${name}`);
  currentName = name;
  networkOverrides = {};
  globalThis.localStorage.setItem('kurio.scenario', name);
}

export function getScenario() {
  const scenario = registry[currentName] ?? registry.default;
  if (!scenario) throw new Error('Cenário padrão ausente');
  return { ...scenario, network: { ...scenario.network, ...networkOverrides } };
}

export function setNetwork(partial: typeof networkOverrides): void {
  networkOverrides = { ...networkOverrides, ...partial };
}
