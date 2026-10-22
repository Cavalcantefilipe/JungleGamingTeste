import { describe, expect, it } from 'vitest';

import { createEventGate } from './event-gate';

import type { RealtimeEvent } from '@/contracts';

function event(overrides: Partial<RealtimeEvent> & { version: number }): RealtimeEvent {
  return {
    id: crypto.randomUUID(),
    type: 'nft.updated',
    resource: { kind: 'nft', id: 'nft_001' },
    occurredAt: '2026-07-29T12:00:00.000Z',
    payload: { price: '2.00' },
    ...overrides,
  } as RealtimeEvent;
}

describe('createEventGate', () => {
  it('ignora evento com id duplicado', () => {
    const gate = createEventGate();
    const first = event({ version: 2 });

    expect(gate.shouldApply(first)).toBe(true);
    expect(gate.shouldApply({ ...first })).toBe(false);
  });

  it('ignora versão menor ou igual à conhecida', () => {
    const gate = createEventGate();

    expect(gate.shouldApply(event({ version: 3 }))).toBe(true);
    expect(gate.shouldApply(event({ version: 2 }))).toBe(false);
    expect(gate.shouldApply(event({ version: 3 }))).toBe(false);
  });

  it('aceita versão maior e sincroniza com a versão vinda do REST', () => {
    const gate = createEventGate();
    gate.syncVersion('nft:nft_001', 5);

    expect(gate.shouldApply(event({ version: 5 }))).toBe(false);
    expect(gate.shouldApply(event({ version: 6 }))).toBe(true);
    gate.reset();
    expect(gate.shouldApply(event({ version: 1 }))).toBe(true);
  });
});
