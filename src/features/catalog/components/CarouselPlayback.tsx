import { Pause, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function CarouselPlayback({ playing, toggle }: { playing: boolean; toggle: () => void }) {
  const Icon = playing ? Pause : Play;
  return (
    <Button
      variant="ghost"
      size="icon"
      className="motion-reduce:hidden"
      data-carousel-playback
      aria-label={playing ? 'Pausar carrossel' : 'Reproduzir carrossel'}
      onClick={toggle}
    >
      <Icon size={16} aria-hidden="true" />
    </Button>
  );
}
