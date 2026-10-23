import { Link } from '@tanstack/react-router';
import { Share2 } from 'lucide-react';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { type Nft } from '@/contracts/nft';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
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
      <div className="mb-2 flex items-center justify-between md:hidden">
        <Button asChild variant="secondary" size="icon" className="rounded-full">
          <Link to="/" aria-label="Voltar para o catálogo">
            <FigmaIcon name="chevron-left" aria-hidden="true" />
          </Link>
        </Button>
        <FavoriteButton
          nftId={nft.id}
          name={nft.name}
          className="border border-border-soft bg-transparent"
        />
      </div>
      <p className="mb-8 hidden text-xs text-text-secondary md:block">Início / Mercado</p>
      <div className="grid items-start gap-0 lg:grid-cols-[573px_minmax(0,1fr)] lg:gap-8">
        <Gallery key={nft.id} images={nft.images} />
        <div
          data-testid="detail-summary"
          className="relative -mx-6 -mt-8 space-y-5 rounded-t-3xl bg-surface-card p-6 md:mx-0 md:mt-0 md:bg-transparent md:p-0 lg:flex lg:min-h-[448px] lg:flex-col lg:gap-3 lg:space-y-0"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2 md:block md:space-y-3">
              <h1 className="text-title font-bold md:text-heading lg:leading-4">{nft.name}</h1>
              <p className="rounded-full border border-primary/50 px-1 text-xs text-text-secondary md:hidden">
                ★ {nft.rating.average}({nft.rating.count})
              </p>
            </div>
          </div>
          <div className="hidden flex-wrap items-center justify-between gap-2 border-b border-border-soft pb-2 md:flex">
            <p data-testid="nft-price" className="text-2xl leading-4 font-bold text-text-accent">
              {formatEth(nft.price)}
            </p>
            <p className="text-xs text-foreground">
              <span aria-hidden="true" className="text-primary">
                ★★★★★
              </span>{' '}
              {nft.rating.count} avaliações de colecionadores
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="hidden text-sm leading-4 font-bold md:block">Sobre este NFT:</h2>
            <p className="text-sm leading-6 text-text-secondary lg:text-xs">{nft.description}</p>
          </div>
          <PurchasePanel key={nft.id} nft={nft} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-3 text-xs text-text-secondary md:pt-1">
            <dt>ID do token</dt>
            <dd>#{nft.tokenId.padStart(4, '0')}</dd>
            <dt>Coleção</dt>
            <dd>{nft.collection}</dd>
            <dt>Atributos</dt>
            <dd>{nft.attributes.map((attribute) => attribute.value).join(', ')}</dd>
          </dl>
          <div className="hidden items-center gap-2 text-xs md:flex lg:mt-auto">
            <span className="font-bold">Compartilhar este NFT:</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Compartilhar NFT"
              onClick={() => {
                share.mutate();
              }}
            >
              <Share2 aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
      <DetailTabs nft={nft} />
      <RelatedCarousel nft={nft} />
      <div className="h-44 lg:hidden" />
    </>
  );
}
