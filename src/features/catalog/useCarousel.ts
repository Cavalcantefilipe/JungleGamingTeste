import { useRef, useState } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function useCarousel(itemCount: number) {
  const desktop = useMediaQuery('(min-width: 768px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const pageSize = desktop ? 5 : 2;
  const track = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState(0);
  const pages = Math.max(1, Math.ceil(itemCount / pageSize));
  const page = Math.min(position, pages - 1);
  const goTo = (next: number) => {
    const bounded = Math.max(0, Math.min(next, pages - 1));
    const element = track.current;
    const first = element?.children.item(0);
    const target = element?.children.item(bounded * pageSize);
    if (first instanceof HTMLElement && target instanceof HTMLElement) {
      element?.scrollTo({
        left: target.offsetLeft - first.offsetLeft,
        behavior: reducedMotion ? 'instant' : 'smooth',
      });
    }
    setPosition(bounded);
  };
  const onScroll = () => {
    const element = track.current;
    if (!element) return;
    const step = element.clientWidth + 20;
    const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
    setPosition(atEnd ? pages - 1 : Math.round(element.scrollLeft / step));
  };
  return { track, page, pages, goTo, onScroll };
}
