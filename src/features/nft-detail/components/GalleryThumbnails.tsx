import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { NftImage } from '@/contracts/nft';
import { cn } from '@/lib/cn';

export function GalleryThumbnails({
  images,
  selected,
  onSelect,
}: {
  images: NftImage[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="hidden w-[100px] shrink-0 flex-col gap-4 lg:flex">
      {images.map((thumbnail, index) => (
        <button
          key={`${thumbnail.src}-${index}`}
          aria-label={`Ver imagem ${index + 1}`}
          aria-pressed={index === selected}
          onClick={() => {
            onSelect(index);
          }}
          className={cn(
            'cursor-pointer overflow-hidden rounded-control border-0 outline-2 outline-transparent transition-colors hover:outline-primary-light focus-visible:ring-2 focus-visible:ring-primary active:opacity-80',
            index === selected && 'outline-primary',
          )}
        >
          <ArtworkImage
            sizes="100px"
            src={thumbnail.src}
            alt=""
            width={100}
            height={100}
            className="aspect-square size-[100px] object-cover"
          />
        </button>
      ))}
    </div>
  );
}
