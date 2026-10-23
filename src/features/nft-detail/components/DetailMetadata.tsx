import type { Nft } from '@/contracts/nft';

export function DetailMetadata({ nft }: { nft: Nft }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-3 text-xs text-text-secondary md:pt-1">
      <dt>ID do token</dt>
      <dd>#{nft.tokenId.padStart(4, '0')}</dd>
      <dt>Coleção</dt>
      <dd>{nft.collection}</dd>
      <dt>Atributos</dt>
      <dd>{nft.attributes.map((attribute) => attribute.value).join(', ')}</dd>
    </dl>
  );
}
