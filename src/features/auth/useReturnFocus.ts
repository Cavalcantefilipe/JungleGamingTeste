import { useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const returnFocusTargets = new WeakMap<Document, HTMLElement>();

export function useReturnFocus() {
  const router = useRouter();
  const [trigger] = useState(() =>
    returnFocusTargets.has(document)
      ? returnFocusTargets.get(document)
      : document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null,
  );
  useEffect(() => {
    if (trigger) returnFocusTargets.set(document, trigger);
  }, [trigger]);
  return (event: Event) => {
    event.preventDefault();
    requestAnimationFrame(() => {
      if (['/login', '/register'].includes(router.state.location.pathname)) return;
      returnFocusTargets.delete(document);
      if (trigger?.isConnected) trigger.focus();
    });
  };
}
