import type { SeedName } from '../db/schema';

export interface NetworkConditions {
  latencyMs: number;
  jitterMs: number;
  failRate: number;
  offline: boolean;
}

export interface ScenarioFlags {
  readsFail?: boolean;
  sessionExpiresOnNextPrivateCall?: boolean;
  registerConflict?: boolean;
  priceChangesAfterQuote?: boolean;
  editionSellsOutAfterQuote?: boolean;
  orderResponseDelayMs?: number;
  paymentDeclined?: boolean;
  favoriteMutationFails?: boolean;
  walletRejected?: boolean;
  walletDisconnected?: boolean;
  duplicateEvents?: boolean;
  staleEvents?: boolean;
}

export interface Scenario {
  name: ScenarioName;
  description: string;
  network: NetworkConditions;
  flags: ScenarioFlags;
  seed: SeedName;
}

export const SCENARIO_NAMES = [
  'default',
  'empty-catalog',
  'slow-network',
  'out-of-order',
  'offline',
  'server-error-reads',
  'session-expired',
  'register-conflict',
  'coupon-expired',
  'price-changed-during-checkout',
  'edition-sold-out-during-checkout',
  'order-timeout',
  'payment-declined',
  'favorite-mutation-fails',
  'wallet-rejected',
  'wallet-disconnected',
  'duplicate-events',
  'stale-events',
] as const;
export type ScenarioName = (typeof SCENARIO_NAMES)[number];

export const DEFAULT_NETWORK: NetworkConditions = {
  latencyMs: 120,
  jitterMs: 40,
  failRate: 0,
  offline: false,
};

interface ScenarioOverrides {
  network?: Partial<NetworkConditions>;
  flags?: ScenarioFlags;
  seed?: SeedName;
}

function scenario(
  name: ScenarioName,
  description: string,
  overrides: ScenarioOverrides = {},
): Scenario {
  return {
    name,
    description,
    network: { ...DEFAULT_NETWORK, ...overrides.network },
    flags: overrides.flags ?? {},
    seed: overrides.seed ?? 'default',
  };
}

export const SCENARIOS: Record<ScenarioName, Scenario> = {
  default: scenario('default', 'Catálogo completo, rede estável, pagamento confirmado em 3 s'),
  'empty-catalog': scenario('empty-catalog', 'Catálogo sem NFTs', { seed: 'empty' }),
  'slow-network': scenario('slow-network', 'Latência de 2 s ± 500 ms', {
    network: { latencyMs: 2000, jitterMs: 500 },
  }),
  'out-of-order': scenario(
    'out-of-order',
    'Latência de 100 a 1500 ms para respostas fora de ordem',
    {
      network: { latencyMs: 800, jitterMs: 700 },
    },
  ),
  offline: scenario('offline', 'Todas as requisições falham como erro de rede', {
    network: { offline: true },
  }),
  'server-error-reads': scenario('server-error-reads', 'Leituras respondem 500', {
    flags: { readsFail: true },
  }),
  'session-expired': scenario('session-expired', 'Próxima chamada privada responde 401', {
    flags: { sessionExpiresOnNextPrivateCall: true },
  }),
  'register-conflict': scenario('register-conflict', 'Cadastro responde conflito de e-mail', {
    flags: { registerConflict: true },
  }),
  'coupon-expired': scenario('coupon-expired', 'Use o cupom EXPIRADO10 no carrinho'),
  'price-changed-during-checkout': scenario(
    'price-changed-during-checkout',
    'Após a cotação, o preço do primeiro item muda e um evento nft.updated é publicado',
    { flags: { priceChangesAfterQuote: true } },
  ),
  'edition-sold-out-during-checkout': scenario(
    'edition-sold-out-during-checkout',
    'Após a cotação, a edição do primeiro item esgota',
    { flags: { editionSellsOutAfterQuote: true } },
  ),
  'order-timeout': scenario(
    'order-timeout',
    'POST /orders responde após 12 s (cliente expira em 6 s)',
    {
      flags: { orderResponseDelayMs: 12_000 },
    },
  ),
  'payment-declined': scenario('payment-declined', 'Pedido é recusado pela rede após 3 s', {
    flags: { paymentDeclined: true },
  }),
  'favorite-mutation-fails': scenario('favorite-mutation-fails', 'Favoritar responde 503', {
    flags: { favoriteMutationFails: true },
  }),
  'wallet-rejected': scenario('wallet-rejected', 'Conexão da carteira é recusada', {
    flags: { walletRejected: true },
  }),
  'wallet-disconnected': scenario(
    'wallet-disconnected',
    'Carteira desconecta antes da confirmação',
    {
      flags: { walletDisconnected: true },
    },
  ),
  'duplicate-events': scenario(
    'duplicate-events',
    'Cada evento de tempo real é emitido duas vezes',
    {
      flags: { duplicateEvents: true },
    },
  ),
  'stale-events': scenario('stale-events', 'Uma versão antiga é emitida depois da nova', {
    flags: { staleEvents: true },
  }),
};

export function isScenarioName(value: string): value is ScenarioName {
  return (SCENARIO_NAMES as readonly string[]).includes(value);
}
