import { useEffect } from 'react';

export function useArtworkRecovery(enabled: boolean, retry: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const resume = () => {
      if (navigator.onLine && document.visibilityState === 'visible') retry();
    };
    window.addEventListener('online', resume);
    window.addEventListener('focus', resume);
    document.addEventListener('visibilitychange', resume);
    return () => {
      window.removeEventListener('online', resume);
      window.removeEventListener('focus', resume);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [enabled, retry]);
}
