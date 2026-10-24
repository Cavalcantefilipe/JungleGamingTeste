import { useCallback, useEffect, useRef, useState } from 'react';

function readPosition(element: HTMLUListElement | null, itemCount: number) {
  const first = element?.firstElementChild;
  if (!element || !(first instanceof HTMLElement)) return { page: 0, pages: 1, pageSize: 1 };
  const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
  const step = first.offsetWidth + gap;
  const pageSize = Math.max(1, Math.floor((element.clientWidth + gap + 1) / step));
  const pages = Math.max(1, Math.ceil(itemCount / pageSize));
  const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
  const page = atEnd ? pages - 1 : Math.round(element.scrollLeft / (step * pageSize));
  return { page: Math.min(page, pages - 1), pages, pageSize };
}

export function useCarousel(itemCount: number) {
  const track = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ page: 0, pages: 1, pageSize: 1 });
  const syncPosition = useCallback(() => {
    setPosition(readPosition(track.current, itemCount));
  }, [itemCount]);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(syncPosition);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [syncPosition]);
  const goTo = (requestedPage: number) => {
    const element = track.current;
    const { pages, pageSize } = readPosition(element, itemCount);
    const page = Math.max(0, Math.min(requestedPage, pages - 1));
    const target = element?.children.item(page * pageSize);
    const first = element?.firstElementChild;
    if (!(target instanceof HTMLElement) || !(first instanceof HTMLElement)) return;
    element?.scrollTo({
      left: target.offsetLeft - first.offsetLeft,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };
  return { track, ...position, goTo, onScroll: syncPosition };
}

export type CarouselNavigationState = Pick<
  ReturnType<typeof useCarousel>,
  'page' | 'pages' | 'goTo'
>;
