import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Nft } from '@/contracts/nft';

export function DetailTabs({ nft }: { nft: Nft }) {
  return (
    <Tabs defaultValue="details" className="mt-16">
      <TabsList className="h-auto flex-wrap bg-transparent p-0">
        <TabsTrigger value="details" className="min-h-11">
          Detalhes do NFT
        </TabsTrigger>
        <TabsTrigger value="reviews" className="min-h-11">
          Avaliações ({nft.rating.count})
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="details"
        className="space-y-6 border-t py-6 text-sm leading-7 text-text-secondary"
      >
        <p>{nft.description}</p>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {nft.attributes.map((attribute) => (
            <div key={attribute.label} className="rounded-lg bg-surface-card p-4">
              <dt className="text-xs">{attribute.label}</dt>
              <dd className="mt-2 font-bold text-foreground">{attribute.value}</dd>
            </div>
          ))}
        </dl>
      </TabsContent>
      <TabsContent value="reviews" className="space-y-3 border-t py-6">
        <p className="text-title">★ {nft.rating.average} de 5</p>
        <p className="text-sm text-text-secondary">
          {nft.rating.count} avaliações. Avaliações individuais indisponíveis nesta demonstração.
        </p>
      </TabsContent>
    </Tabs>
  );
}
