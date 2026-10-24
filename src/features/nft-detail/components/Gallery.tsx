import { useState } from 'react';

import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { NftImage } from '@/contracts/nft';
import { GalleryThumbnails } from '@/features/nft-detail/components/GalleryThumbnails';
import { GalleryZoom } from '@/features/nft-detail/components/GalleryZoom';

export function Gallery({ images }: { images: NftImage[] }) {
  const [selected, setSelected] = useState(0);
  const image = images[selected] ?? images[0];
  return (
    <div className="flex items-center lg:gap-[29px]">
      <GalleryThumbnails images={images} selected={selected} onSelect={setSelected} />
      <div
        data-testid="gallery-frame"
        className="relative ml-1 w-[calc(100%-5px)] min-w-0 md:ml-0 md:w-full lg:flex lg:size-[444px] lg:shrink-0 lg:items-center lg:justify-center lg:rounded-control lg:bg-surface-card lg:p-4"
      >
        <ArtworkImage
          sizes="(min-width: 1024px) 404px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 48px)"
          loading="eager"
          data-testid="gallery-image"
          src={image?.src}
          alt={image?.alt ?? ''}
          width={404}
          height={404}
          fetchPriority="high"
          className="aspect-[361/356] w-full rounded-3xl object-cover md:aspect-square lg:size-[404px]"
        />
        <GalleryZoom image={image} />
      </div>
    </div>
  );
}
