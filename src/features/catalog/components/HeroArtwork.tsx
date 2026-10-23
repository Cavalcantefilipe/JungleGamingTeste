import { ArtworkImage } from '@/components/media/ArtworkImage';
import { Skeleton } from '@/components/ui/skeleton';
import type { Nft } from '@/contracts/nft';

interface HeroArtworkProps {
  nft: Nft | undefined;
  secondary: Nft | undefined;
  loading: boolean;
}
export function HeroArtwork({ nft, secondary, loading }: HeroArtworkProps) {
  return (
    <div className="absolute top-3 right-4 w-[38%] max-w-[138px] md:static md:w-full md:max-w-none">
      {loading ? (
        <Skeleton className="aspect-square w-full rounded-xl md:rounded-3xl" />
      ) : nft ? (
        <ArtworkImage
          sizes="(min-width: 1280px) 450px, (min-width: 768px) 40vw, 138px"
          loading="eager"
          src={nft.images[0]?.src}
          alt={nft.images[0]?.alt ?? nft.name}
          width={450}
          height={450}
          fetchPriority="high"
          className="aspect-square w-full rounded-2xl object-cover md:rounded-3xl"
        />
      ) : (
        <div className="aspect-square rounded-xl bg-surface-raised md:rounded-3xl" />
      )}
      {secondary && (
        <ArtworkImage
          sizes="58px"
          src={secondary.images[0]?.src}
          alt=""
          width={58}
          height={58}
          className="absolute -bottom-2 left-3.5 size-[58px] rounded-2xl object-cover md:hidden"
        />
      )}
    </div>
  );
}
