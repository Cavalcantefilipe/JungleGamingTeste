import type { ComponentProps } from 'react';

export function ArtworkImage({
  src,
  alt,
  sizes,
  loading = 'lazy',
  ...props
}: Omit<ComponentProps<'img'>, 'src' | 'alt' | 'sizes'> & {
  src: string | undefined;
  alt: string;
  sizes: string;
}) {
  const base = src?.match(/^(\/images\/nfts\/[^/]+)-800\.webp$/)?.[1];
  const sources = (format: string) => `${base}-400.${format} 400w, ${base}-800.${format} 800w`;
  return (
    <picture className="contents">
      {base && (
        <source className="hidden" type="image/avif" srcSet={sources('avif')} sizes={sizes} />
      )}
      <img
        {...props}
        src={src}
        alt={alt}
        loading={loading}
        sizes={base ? sizes : undefined}
        srcSet={base ? sources('webp') : undefined}
      />
    </picture>
  );
}
