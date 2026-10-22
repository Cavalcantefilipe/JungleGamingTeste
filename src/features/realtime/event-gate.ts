import { realtimeResourceKey, type RealtimeEvent } from '@/contracts';

const SEEN_EVENTS_LIMIT = 500;

export interface EventGate {
  shouldApply(event: RealtimeEvent): boolean;
  syncVersion(resourceKey: string, version: number): void;
  reset(): void;
}

export function createEventGate(): EventGate {
  const seenIds = new Set<string>();
  const versions = new Map<string, number>();

  const remember = (id: string) => {
    seenIds.add(id);
    if (seenIds.size <= SEEN_EVENTS_LIMIT) return;
    const oldest = seenIds.values().next().value;
    if (oldest !== undefined) seenIds.delete(oldest);
  };

  return {
    shouldApply(event) {
      if (seenIds.has(event.id)) return false;
      remember(event.id);
      const key = realtimeResourceKey(event);
      const known = versions.get(key);
      if (known !== undefined && event.version <= known) return false;
      versions.set(key, event.version);
      return true;
    },
    syncVersion(resourceKey, version) {
      const known = versions.get(resourceKey);
      if (known === undefined || version > known) versions.set(resourceKey, version);
    },
    reset() {
      seenIds.clear();
      versions.clear();
    },
  };
}
