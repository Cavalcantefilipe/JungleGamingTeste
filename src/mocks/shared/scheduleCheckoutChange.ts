import type { QuoteInput } from '@/contracts/quote';
import { addEth } from '@/lib/money';
import { mockStore } from '@/mocks/db/store';
import { claimScenarioEffect, getScenario, getScenarioRevision } from '@/mocks/scenarios/current';
import { emitMockEvent } from '@/mocks/socket/events';

export function scheduleCheckoutChange(input: QuoteInput): void {
  const name = getScenario().name;
  const item = input.items[0];
  if (
    !item ||
    !['price-changed-during-checkout', 'edition-sold-out-during-checkout'].includes(name)
  )
    return;
  if (!claimScenarioEffect('checkout-change')) return;
  const revision = getScenarioRevision();
  setTimeout(() => {
    if (revision !== getScenarioRevision()) return;
    const nft = mockStore.read().nfts.find((entry) => entry.id === item.nftId);
    if (!nft) return;
    try {
      emitMockEvent({
        id: crypto.randomUUID(),
        type: 'nft.updated',
        resource: { kind: 'nft', id: nft.id },
        version: nft.version + 1,
        occurredAt: new Date().toISOString(),
        payload: {
          price: name === 'price-changed-during-checkout' ? addEth(nft.price, '0.1') : nft.price,
          editions: nft.editions.map((edition) =>
            name === 'edition-sold-out-during-checkout' && edition.id === item.editionId
              ? { ...edition, available: 0 }
              : edition,
          ),
          badges: nft.badges,
        },
      });
    } catch (error) {
      console.warn('Não foi possível aplicar a mudança do cenário.', error);
    }
  }, 1000);
}
