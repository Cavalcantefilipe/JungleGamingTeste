import { useState } from 'react';

import { useArtworkRecovery } from '@/components/media/useArtworkRecovery';

type ArtworkPhase = 'responsive' | 'webp' | 'retry' | 'unavailable';
interface ArtworkState {
  src: string | undefined;
  phase: ArtworkPhase;
  attempt: number;
}

function retrySource(src: string | undefined, attempt: number) {
  if (!src) return src;
  const [path, hash] = src.split('#');
  return `${path}${src.includes('?') ? '&' : '?'}kurio_retry=${attempt}${hash ? `#${hash}` : ''}`;
}

export function useArtworkSource(src: string | undefined) {
  const [state, setState] = useState<ArtworkState>();
  if (state && state.src !== src) setState(undefined);
  const current = state?.src === src ? state : undefined;
  const phase = current?.phase ?? 'responsive';
  const attempt = current?.attempt ?? 0;
  const base = src?.match(/^(\/images\/nfts\/[^/]+)-800\.webp$/)?.[1];
  useArtworkRecovery(phase === 'unavailable' && Boolean(src && !src.startsWith('data:')), () => {
    setState({ src, phase: 'retry', attempt: attempt + 1 });
  });
  const fail = (failedSource: string) => {
    const fallback = base && phase === 'responsive' && /\.avif(?:[?#]|$)/.test(failedSource);
    const canRetry = src && !src.startsWith('data:') && phase !== 'retry';
    const nextPhase = fallback ? 'webp' : canRetry ? 'retry' : 'unavailable';
    setState({ src, phase: nextPhase, attempt: nextPhase === 'retry' ? attempt + 1 : attempt });
  };
  return {
    src: phase === 'retry' ? retrySource(src, attempt) : src,
    base: phase === 'responsive' || phase === 'webp' ? base : undefined,
    avif: phase === 'responsive',
    unavailable: !src || phase === 'unavailable',
    fail,
  };
}
