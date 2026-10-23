import { useState } from 'react';

export function useReturnFocus() {
  const [trigger] = useState(() =>
    document.activeElement instanceof HTMLElement ? document.activeElement : null,
  );
  return (event: Event) => {
    event.preventDefault();
    requestAnimationFrame(() => {
      if (trigger?.isConnected) trigger.focus();
    });
  };
}
