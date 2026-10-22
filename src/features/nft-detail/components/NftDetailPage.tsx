import { Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NFT_NETWORK_LABELS, type Nft } from '@/contracts/nft';
import { useShareLink } from '@/features/nft-detail/useShareLink';
import { formatEth } from '@/lib/money';

import { DetailTabs } from './DetailTabs';
import { Gallery } from './Gallery';
import { PurchasePanel } from './PurchasePanel';
import { RelatedCarousel } from './RelatedCarousel';

export function NftDetailPage({ nft }: { nft: Nft }) {
  const share = useShareLink();
  return (
    <>
      <p className="mb-8 text-xs text-text-secondary">
        Início / {nft.collection} / {nft.name}
      </p>
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <Gallery key={nft.id} images={nft.images} />
        <div className="space-y-7">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs text-primary">{nft.collection}</p>
              <h1 className="text-heading-sm font-bold sm:text-heading">{nft.name}</h1>
              <p className="text-xs text-text-secondary">
                ★ {nft.rating.average} · {nft.rating.count} avaliações de colecionadores
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Compartilhar NFT"
              onClick={() => {
                share.mutate();
              }}
            >
              <Share2 aria-hidden="true" size={18} />
            </Button>
          </div>
          <p data-testid="nft-price" className="text-title font-bold text-text-accent">
            {formatEth(nft.price)}
          </p>
          <p className="text-sm leading-7 text-text-secondary">{nft.description}</p>
          <PurchasePanel key={nft.id} nft={nft} />
          <dl className="grid grid-cols-2 gap-3 border-t pt-5 text-xs text-text-secondary">
            <dt>Rede</dt>
            <dd>{NFT_NETWORK_LABELS[nft.network]}</dd>
            <dt>Identificação do token</dt>
            <dd>#{nft.tokenId}</dd>
          </dl>
        </div>
      </div>
      <DetailTabs nft={nft} />
      <RelatedCarousel nft={nft} />
      <div className="h-32 lg:hidden" />
    </>
  );
}
