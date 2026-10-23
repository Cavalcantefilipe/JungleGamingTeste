import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { ArtworkImage } from '@/components/media/ArtworkImage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { NftImage } from '@/contracts/nft';

export function GalleryZoom({ image }: { image: NftImage | undefined }) {
  if (!image) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="zoom"
          size="icon"
          aria-label="Ampliar imagem"
          className="absolute top-2 right-2 hidden lg:inline-flex"
        >
          <FigmaIcon name="search" size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="bg-surface-card sm:max-w-3xl">
        <DialogTitle>Imagem ampliada</DialogTitle>
        <ArtworkImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 720px, calc(100vw - 80px)"
          className="max-h-[75dvh] w-full rounded-media object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
