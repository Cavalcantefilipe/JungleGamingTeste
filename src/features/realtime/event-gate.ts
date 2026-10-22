import { realtimeResourceKey, type RealtimeEvent } from '@/contracts/realtime';

const MAX_EVENT_IDS = 500;
export function createEventGate() {
  const ids = new Set<string>();
  const versions = new Map<string, number>();
  const syncVersion = (resource: string, version: number) => {
    versions.set(resource, Math.max(versions.get(resource) ?? -1, version));
  };
  return {
    syncVersion,
    shouldApply(event: RealtimeEvent): boolean {
      if (ids.has(event.id)) return false;
      ids.add(event.id);
      if (ids.size > MAX_EVENT_IDS) {
        const oldest = ids.values().next().value;
        if (oldest) ids.delete(oldest);
      }
      const resource = realtimeResourceKey(event);
      if ((versions.get(resource) ?? -1) >= event.version) return false;
      syncVersion(resource, event.version);
      return true;
    },
  };
}
