import { useState } from 'react';

import { cn } from '@/lib/cn';

import type { NftImage } from '@/contracts';

export function Gallery({ images }: { images: NftImage[] }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) return null;
  return (
    <div className="grid gap-4 md:grid-cols-[96px_1fr]">
      <ul
        className="order-last flex gap-3 overflow-x-auto md:order-none md:flex-col"
        aria-label="Miniaturas"
      >
        {images.map((image, position) => (
          <li key={image.src + String(position)}>
            <button
              type="button"
              aria-label={`Imagem ${position + 1}`}
              aria-pressed={position === index}
              onClick={() => {
                setIndex(position);
              }}
              className={cn(
                'block size-20 overflow-hidden rounded-card border-2 transition-colors md:size-24',
                position === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-border-soft',
              )}
            >
              <img
                src={image.src}
                alt=""
                width={96}
                height={96}
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <img
        src={current.src}
        alt={current.alt}
        width={current.width}
        height={current.height}
        loading="eager"
        fetchPriority="high"
        className="aspect-square w-full rounded-media object-cover"
      />
    </div>
  );
}
