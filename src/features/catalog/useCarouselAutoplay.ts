import { useEffect, useEffectEvent, useRef, useState } from 'react';

import type { CarouselNavigationState } from '@/features/catalog/useCarousel';

export function useCarouselAutoplay({ page, pages, goTo }: CarouselNavigationState) {
  const container = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(true);
  const advance = useEffectEvent(() => {
    const element = container.current;
    const focused = document.activeElement;
    if (!element || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    if (element.matches(':hover')) return;
    if (element.contains(focused) && !focused?.hasAttribute('data-carousel-playback')) return;
    goTo((page + 1) % pages);
  });
  useEffect(() => {
    const element = container.current;
    if (!element || !playing || pages < 2) return;
    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (visible) advance();
    }, 5000);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [playing, pages]);
  return {
    container,
    playing,
    toggle: () => {
      setPlaying((value) => !value);
    },
  };
}
