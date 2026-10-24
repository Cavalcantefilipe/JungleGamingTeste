import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import type { Nft } from '@/contracts/nft';

import { useDetailNavigation } from '../useDetailNavigation';
import { BuyerReviews } from './BuyerReviews';
import { DetailFacts } from './DetailFacts';
import { DetailTabTrigger } from './DetailTabTrigger';

export function DetailTabs({ nft }: { nft: Nft }) {
  const { tab, setTab } = useDetailNavigation();
  return (
    <Tabs value={tab} onValueChange={setTab} className="mt-section">
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
      <TabsContent value="reviews">
        <BuyerReviews key={nft.id} nft={nft} />
      </TabsContent>
    </Tabs>
  );
}
