import {
  isScenarioName,
  SCENARIOS,
  type NetworkConditions,
  type Scenario,
  type ScenarioFlags,
  type ScenarioName,
} from './registry';

export const SCENARIO_STORAGE_KEY = 'kurio.scenario';
export const SCENARIO_QUERY_PARAM = 'scenario';

let currentName: ScenarioName = 'default';
let networkOverride: Partial<NetworkConditions> = {};
let flagOverrides: Partial<ScenarioFlags> = {};

function readStorage(): string | null {
  try {
    return localStorage.getItem(SCENARIO_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(name: ScenarioName): void {
  try {
    localStorage.setItem(SCENARIO_STORAGE_KEY, name);
  } catch {
    return;
  }
}

export function resolveInitialScenario(search: string, fallback: string): ScenarioName {
  const fromUrl = new URLSearchParams(search).get(SCENARIO_QUERY_PARAM);
  const candidate = fromUrl ?? readStorage() ?? fallback;
  return isScenarioName(candidate) ? candidate : 'default';
}

export function setScenario(name: ScenarioName): Scenario {
  currentName = name;
  networkOverride = {};
  flagOverrides = {};
  writeStorage(name);
  return getScenario();
}

export function setNetwork(override: Partial<NetworkConditions>): NetworkConditions {
  networkOverride = { ...networkOverride, ...override };
  return getScenario().network;
}

export function consumeFlag(name: keyof ScenarioFlags): boolean {
  const active = Boolean(getScenario().flags[name]);
  if (active) flagOverrides = { ...flagOverrides, [name]: false };
  return active;
}

export function getScenario(): Scenario {
  const base = SCENARIOS[currentName];
  return {
    ...base,
    network: { ...base.network, ...networkOverride },
    flags: { ...base.flags, ...flagOverrides },
  };
}
