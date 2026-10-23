import type { MouseEvent } from 'react';

export function focusClickedElement(event: MouseEvent<HTMLElement>): void {
  event.currentTarget.focus({ preventScroll: true });
}
