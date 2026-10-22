export const STORAGE_KEYS = {
  session: 'kurio.session',
  guestId: 'kurio.guestId',
  pendingOrder: 'kurio.pendingOrder',
  checkoutDraftPrefix: 'kurio.checkoutDraft.',
} as const;

const PRIVATE_KEYS: readonly string[] = [STORAGE_KEYS.pendingOrder];
const PRIVATE_PREFIXES: readonly string[] = [STORAGE_KEYS.checkoutDraftPrefix];

function removeMatching(storage: Storage): void {
  const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
  keys
    .filter(
      (key): key is string =>
        key !== null &&
        (PRIVATE_KEYS.includes(key) || PRIVATE_PREFIXES.some((prefix) => key.startsWith(prefix))),
    )
    .forEach((key) => {
      storage.removeItem(key);
    });
}

export function clearPrivateStorage(): void {
  try {
    removeMatching(localStorage);
    removeMatching(sessionStorage);
  } catch (error) {
    console.warn('Não foi possível limpar o armazenamento privado', error);
  }
}
