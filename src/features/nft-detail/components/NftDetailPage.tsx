import { Link } from '@tanstack/react-router';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';

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
      <div className="mb-2 flex items-center justify-between md:hidden">
        <Button asChild variant="secondary" size="icon" className="rounded-full">
          <Link to="/" aria-label="Voltar para o catálogo">
            <ArrowLeft aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="secondary" size="icon" className="rounded-full">
          <Link
            to="/login"
            search={{ returnTo: `/nfts/${nft.id}` }}
            aria-label={`Favoritar ${nft.name}`}
          >
            <Heart aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <p className="mb-8 hidden text-xs text-text-secondary md:block">
        Início / {nft.collection} / {nft.name}
      </p>
      <div className="grid items-start gap-0 lg:grid-cols-2 lg:gap-12">
        <Gallery key={nft.id} images={nft.images} />
        <div
          data-testid="detail-summary"
          className="relative -mx-6 -mt-8 space-y-5 rounded-t-3xl bg-surface-card p-6 md:mx-0 md:mt-0 md:bg-transparent md:p-0 lg:space-y-7"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2 md:block md:space-y-3">
              <p className="hidden text-xs text-primary md:block">{nft.collection}</p>
              <h1 className="text-title font-bold md:text-heading">{nft.name}</h1>
              <p className="rounded-full border border-primary/50 px-1 text-xs text-text-secondary md:border-0 md:px-0">
                ★ {nft.rating.average}
                <span className="md:hidden">({nft.rating.count})</span>
                <span className="hidden md:inline">
                  {' '}
                  · {nft.rating.count} avaliações de colecionadores
                </span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Compartilhar NFT"
              className="hidden md:inline-flex"
              onClick={() => {
                share.mutate();
              }}
            >
              <Share2 aria-hidden="true" size={18} />
            </Button>
          </div>
          <p
            data-testid="nft-price"
            className="hidden text-title font-bold text-text-accent md:block"
          >
            {formatEth(nft.price)}
          </p>
          <p className="text-sm leading-6 text-text-secondary">{nft.description}</p>
          <PurchasePanel key={nft.id} nft={nft} />
          <dl className="grid grid-cols-2 gap-3 text-xs text-text-secondary md:border-t md:pt-5">
            <dt>Rede</dt>
            <dd>{NFT_NETWORK_LABELS[nft.network]}</dd>
            <dt>ID do token</dt>
            <dd>#{nft.tokenId}</dd>
            <dt>Coleção</dt>
            <dd>{nft.collection}</dd>
            <dt>Atributos</dt>
            <dd>{nft.attributes.map((attribute) => attribute.value).join(', ')}</dd>
          </dl>
        </div>
      </div>
      <DetailTabs nft={nft} />
      <RelatedCarousel nft={nft} />
      <div className="h-44 lg:hidden" />
    </>
  );
}
