import { useState } from 'react';

import type { NftImage } from '@/contracts/nft';
import { cn } from '@/lib/cn';

export function Gallery({ images }: { images: NftImage[] }) {
  const [selected, setSelected] = useState(0);
  const image = images[selected] ?? images[0];
  return (
    <div className="flex items-start gap-5">
      <div className="hidden w-16 shrink-0 space-y-3 lg:block">
        {images.map((thumbnail, index) => (
          <button
            key={thumbnail.src}
            aria-label={`Ver imagem ${index + 1}`}
            aria-pressed={index === selected}
            onClick={() => {
              setSelected(index);
            }}
            className={cn(
              'cursor-pointer overflow-hidden rounded-lg border-2 border-transparent transition-colors hover:border-primary-light',
              index === selected && 'border-primary',
            )}
          >
            <img
              src={thumbnail.src}
              alt=""
              width={64}
              height={64}
              className="aspect-square object-cover"
            />
          </button>
        ))}
      </div>
      <img
        src={image?.src}
        alt={image?.alt ?? ''}
        width={560}
        height={560}
        fetchPriority="high"
        className="aspect-square min-w-0 flex-1 rounded-3xl object-cover"
      />
    </div>
  );
}
