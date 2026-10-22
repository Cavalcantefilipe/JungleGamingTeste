import { describe, expect, it } from 'vitest';

import type { NftUpdatedEvent } from '@/contracts/realtime';

import { createEventGate } from './event-gate';

const event = (version = 2): NftUpdatedEvent => ({
  id: crypto.randomUUID(),
  type: 'nft.updated',
  resource: { kind: 'nft', id: 'nft-001' },
  occurredAt: new Date().toISOString(),
  version,
  payload: { price: '2.2' },
});
describe('gate de eventos', () => {
  it('ignora id duplicado', () => {
    const gate = createEventGate();
    const update = event();
    expect(gate.shouldApply(update)).toBe(true);
    expect(gate.shouldApply({ ...update, version: 3 })).toBe(false);
  });
  it('ignora versão menor ou igual e aceita a maior', () => {
    const gate = createEventGate();
    gate.syncVersion('nft:nft-001', 3);
    expect(gate.shouldApply(event(2))).toBe(false);
    expect(gate.shouldApply(event(3))).toBe(false);
    expect(gate.shouldApply(event(4))).toBe(true);
    gate.syncVersion('nft:nft-001', 1);
    expect(gate.shouldApply(event(3))).toBe(false);
  });
});
