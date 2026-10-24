import { nftIdentityMessages } from '@/components/media/messages';
import type { Nft } from '@/contracts/nft';

export function DetailMetadata({ nft }: { nft: Nft }) {
  return (
    <dl className="space-y-3 text-body-sm leading-5 text-secondary md:pt-1">
      <div>
        <dt className="inline">{nftIdentityMessages.tokenId} </dt>
        <dd className="inline">#{nft.tokenId.padStart(4, '0')}</dd>
      </div>
      <div>
        <dt className="inline">Coleção: </dt>
        <dd className="inline">{nft.collection}</dd>
      </div>
      <div>
        <dt className="inline">Atributos: </dt>
        <dd className="inline">{nft.attributes.map((attribute) => attribute.value).join(', ')}</dd>
      </div>
    </dl>
  );
}
