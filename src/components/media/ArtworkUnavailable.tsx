import { ImageOff } from 'lucide-react';

import { artworkMessages } from '@/components/media/messages';
import { cn } from '@/lib/cn';

import type { ComponentProps } from 'react';

export function ArtworkUnavailable({
  alt,
  className,
  testId,
  dimensions,
}: {
  alt: string;
  className: string | undefined;
  testId: string | undefined;
  dimensions: Pick<ComponentProps<'img'>, 'width' | 'height'>;
}) {
  const width = Number(dimensions.width) || 24;
  const height = Number(dimensions.height) || 24;
  return (
    <svg
      role={alt ? 'img' : undefined}
      aria-label={alt ? `${artworkMessages.unavailable}: ${alt}` : undefined}
      aria-hidden={!alt}
      data-testid={testId}
      data-artwork-state="unavailable"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-auto', className, 'bg-surface-raised text-text-secondary')}
    >
      <ImageOff aria-hidden="true" size={24} x={(width - 24) / 2} y={(height - 24) / 2} />
    </svg>
  );
}
