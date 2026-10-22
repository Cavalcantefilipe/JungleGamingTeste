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

export const registry = Object.fromEntries(
  SCENARIO_NAMES.map((name) => [
    name,
    {
      name,
      seed: name === 'empty-catalog' ? 'empty' : 'default',
      network: {
        latencyMs: name === 'slow-network' ? 2000 : 120,
        jitterMs: name === 'slow-network' ? 500 : 0,
        failRate: 0,
        offline: name === 'offline',
      },
    },
  ]),
);
