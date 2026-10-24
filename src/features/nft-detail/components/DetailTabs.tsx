import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NFT_NETWORK_LABELS, type Nft } from '@/contracts';

import { detailMessages } from '../messages';
import { RatingStars } from './RatingStars';

const CONTRACT_BY_NETWORK: Record<Nft['network'], string> = {
  ethereum: '0x7A42…19E8 · Contrato inteligente ERC-721 verificado',
  polygon: '0x3C91…B204 · Contrato inteligente ERC-721 verificado na Polygon',
  solana: 'Hx9k…4Qrt · Programa Metaplex verificado',
};

export function DetailTabs({ nft }: { nft: Nft }) {
  return (
    <Tabs defaultValue="details" className="gap-6">
      <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b border-border bg-transparent p-0 md:gap-6">
        <TabsTrigger
          value="details"
          className="min-h-11 min-w-0 rounded-none border-b-2 border-transparent px-0 pb-2 text-caption whitespace-normal data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary md:text-body-lg"
        >
          {detailMessages.tabDetails}
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="min-h-11 min-w-0 rounded-none border-b-2 border-transparent px-0 pb-2 text-caption whitespace-normal data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary md:text-body-lg"
        >
          {detailMessages.tabReviews(nft.rating.count)}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="flex flex-col gap-4 text-body text-text-secondary">
        <p>{nft.description}</p>
        <p>
          A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores
          e um registro permanente de procedência verificável na rede. Cada edição é cunhada sob
          demanda e vinculada ao seu endereço.
        </p>
        <dl className="grid gap-3">
          <div>
            <dt className="font-bold text-foreground">Rede:</dt>
            <dd>
              Cunhado na {NFT_NETWORK_LABELS[nft.network]} com procedência imutável e metadados
              armazenados em IPFS.
            </dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Contrato:</dt>
            <dd>{CONTRACT_BY_NETWORK[nft.network]}</dd>
          </div>
          <div>
            <dt className="font-bold text-foreground">Direitos autorais:</dt>
            <dd>
              Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos
              mercados compatíveis.
            </dd>
          </div>
        </dl>
      </TabsContent>
      <TabsContent value="reviews" className="flex flex-col gap-3 text-body text-text-secondary">
        <RatingStars average={nft.rating.average} count={nft.rating.count} />
        <p>{detailMessages.reviewsUnavailable}</p>
      </TabsContent>
    </Tabs>
  );
}
