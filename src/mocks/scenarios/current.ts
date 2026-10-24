import { registry } from '@/mocks/scenarios/registry';

let currentName = 'default';
let revision = 0;
const effects = new Set<string>();
let networkOverrides: Partial<{
  latencyMs: number;
  jitterMs: number;
  failRate: number;
  offline: boolean;
}> = {};

export function setScenario(name: string): void {
  if (!registry[name]) throw new Error(`Cenário desconhecido: ${name}`);
  currentName = name;
  revision++;
  effects.clear();
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

export function getScenarioRevision(): number {
  return revision;
}
export function claimScenarioEffect(key: string): boolean {
  if (effects.has(key)) return false;
  effects.add(key);
  return true;
}
