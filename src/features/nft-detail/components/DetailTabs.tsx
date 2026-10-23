import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import type { Nft } from '@/contracts/nft';

import { DetailFacts } from './DetailFacts';
import { DetailTabTrigger } from './DetailTabTrigger';
import { RatingStars } from './RatingStars';

export function DetailTabs({ nft }: { nft: Nft }) {
  return (
    <Tabs defaultValue="details" className="mt-section">
      <TabsList
        variant="line"
        className="h-auto w-full flex-wrap justify-start gap-x-8 rounded-none border-b border-border p-0 group-data-[orientation=horizontal]/tabs:h-auto"
      >
        <DetailTabTrigger value="details">Detalhes do NFT</DetailTabTrigger>
        <DetailTabTrigger value="reviews">
          <span className="md:hidden">Avaliações ({nft.rating.count})</span>
          <span className="hidden md:inline">
            Avaliações de colecionadores ({nft.rating.count})
          </span>
        </DetailTabTrigger>
      </TabsList>
      <TabsContent value="details">
        <DetailFacts nft={nft} />
      </TabsContent>
      <TabsContent value="reviews" className="space-y-3 py-6">
        <div className="flex items-center gap-3">
          <RatingStars rating={nft.rating} />
          <p className="text-title">{nft.rating.average} de 5</p>
        </div>
        <p className="text-sm text-text-secondary">
          {nft.rating.count} avaliações. Avaliações individuais indisponíveis nesta demonstração.
        </p>
      </TabsContent>
    </Tabs>
  );
}
