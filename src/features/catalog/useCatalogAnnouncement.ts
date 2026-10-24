import { useRouter, type RouterEvents } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useState } from 'react';

export function useCatalogAnnouncement(effectivePage: number | undefined) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState({ enabled: false, navigating: false });
  const startAnnouncement = useEffectEvent((event: RouterEvents['onBeforeNavigate']) => {
    if (
      event.fromLocation?.pathname !== '/' ||
      event.toLocation.pathname !== '/' ||
      event.fromLocation.searchStr === event.toLocation.searchStr
    )
      return;
    if (
      effectivePage !== undefined &&
      Number(new URLSearchParams(event.fromLocation.searchStr).get('page')) > effectivePage &&
      Number(new URLSearchParams(event.toLocation.searchStr).get('page')) === effectivePage
    )
      return;
    setAnnouncement({ enabled: true, navigating: true });
  });
  useEffect(() => {
    const stopBeforeNavigate = router.subscribe('onBeforeNavigate', (event) => {
      startAnnouncement(event);
    });
    const stopResolved = router.subscribe('onResolved', () => {
      setAnnouncement((current) =>
        current.navigating ? { ...current, navigating: false } : current,
      );
    });
    return () => {
      stopBeforeNavigate();
      stopResolved();
    };
  }, [router]);
  return announcement;
}
