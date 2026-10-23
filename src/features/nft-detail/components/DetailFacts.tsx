import { NFT_NETWORK_LABELS, type Nft } from '@/contracts/nft';

export function DetailFacts({ nft }: { nft: Nft }) {
  return (
    <div className="space-y-6 py-2 text-sm leading-7 text-text-secondary">
      <p>{nft.description}</p>
      <dl className="space-y-3">
        <div>
          <dt className="font-bold text-foreground">Rede</dt>
          <dd>{NFT_NETWORK_LABELS[nft.network]}</dd>
        </div>
        {nft.attributes.map((attribute) => (
          <div key={attribute.label}>
            <dt className="font-bold text-foreground">{attribute.label}</dt>
            <dd>{attribute.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
