import { ArtworkUnavailable } from '@/components/media/ArtworkUnavailable';
import { useArtworkSource } from '@/components/media/useArtworkSource';

import type { ComponentProps } from 'react';

type ArtworkImageProps = Omit<ComponentProps<'img'>, 'src' | 'alt' | 'sizes'> & {
  src: string | undefined;
  alt: string;
  sizes: string;
  'data-testid'?: string;
};

export function ArtworkImage({
  src,
  alt,
  sizes,
  loading = 'lazy',
  className,
  onError,
  'data-testid': testId,
  ...props
}: ArtworkImageProps) {
  const artwork = useArtworkSource(src);
  const base = artwork.base;
  const sources = (format: string) => `${base}-400.${format} 400w, ${base}-800.${format} 800w`;
  if (artwork.unavailable)
    return (
      <ArtworkUnavailable alt={alt} className={className} testId={testId} dimensions={props} />
    );
  return (
    <picture className="contents">
      {base && artwork.avif && (
        <source className="hidden" type="image/avif" srcSet={sources('avif')} sizes={sizes} />
      )}
      <img
        {...props}
        src={artwork.src}
        alt={alt}
        className={className}
        data-testid={testId}
        onError={(event) => {
          artwork.fail(event.currentTarget.currentSrc || event.currentTarget.src);
          onError?.(event);
        }}
        loading={loading}
        sizes={base ? sizes : undefined}
        srcSet={base ? sources('webp') : undefined}
      />
    </picture>
  );
}
