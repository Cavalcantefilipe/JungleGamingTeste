import { useSyncExternalStore } from 'react';

let message = '';
let version = 0;
const listeners = new Set<() => void>();

export function announce(text: string): void {
  message = text;
  version += 1;
  listeners.forEach((listener) => {
    listener();
  });
}

export function useAnnouncement(): { message: string; version: number } {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => snapshotFor(message, version),
    () => snapshotFor('', 0),
  );
}

let cached = { message: '', version: 0 };
function snapshotFor(text: string, current: number) {
  if (cached.version !== current) cached = { message: text, version: current };
  return cached;
}
