let message = '';
const listeners = new Set<() => void>();
export function announce(next: string): void {
  message = next;
  for (const listener of listeners) listener();
}
export const liveAnnouncement = {
  getSnapshot: () => message,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
