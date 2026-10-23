import { useState } from 'react';

import type { NftImage } from '@/contracts/nft';
import { cn } from '@/lib/cn';

export function Gallery({ images }: { images: NftImage[] }) {
  const [selected, setSelected] = useState(0);
  const image = images[selected] ?? images[0];
  return (
    <div className="flex items-center lg:gap-[29px]">
      <div className="hidden w-[100px] shrink-0 space-y-4 lg:block">
        {images.map((thumbnail, index) => (
          <button
            key={`${thumbnail.src}-${index}`}
            aria-label={`Ver imagem ${index + 1}`}
            aria-pressed={index === selected}
            onClick={() => {
              setSelected(index);
            }}
            className={cn(
              'cursor-pointer overflow-hidden rounded-control border-0 outline-2 outline-transparent transition-colors hover:outline-primary-light',
              index === selected && 'outline-primary',
            )}
          >
            <img
              src={thumbnail.src}
              alt=""
              width={100}
              height={100}
              className="aspect-square size-[100px] object-cover"
            />
          </button>
        ))}
      </div>
      <div className="w-full min-w-0 lg:flex lg:size-[444px] lg:shrink-0 lg:items-center lg:justify-center lg:rounded-control lg:bg-surface-card lg:p-4">
        <img
          data-testid="gallery-image"
          src={image?.src}
          alt={image?.alt ?? ''}
          width={404}
          height={404}
          fetchPriority="high"
          className="aspect-square w-full rounded-3xl object-cover lg:size-[404px]"
        />
      </div>
    </div>
  );
}
