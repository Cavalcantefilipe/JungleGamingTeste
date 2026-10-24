import { NFT_NETWORK_LABELS, type Nft } from '@/contracts/nft';

export function DetailFacts({ nft }: { nft: Nft }) {
  const facts = nft.details
    ? [
        { label: 'Rede', value: nft.details.provenance },
        { label: 'Contrato', value: `${nft.details.contract} · ${nft.details.standard}` },
        {
          label: 'Direitos autorais',
          value: `${nft.details.creator}: ${nft.details.royaltyPercent}% nas vendas secundárias, pagos pelos mercados compatíveis.`,
        },
      ]
    : [{ label: 'Rede', value: NFT_NETWORK_LABELS[nft.network] }, ...nft.attributes];
  return (
    <div className="space-y-6 py-2 text-sm leading-7 text-text-secondary">
      {(nft.details?.paragraphs ?? [nft.description]).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <dl className="space-y-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-bold text-foreground">{fact.label}</dt>
            <dd className="wrap-anywhere">{fact.value}</dd>
          </div>
        ))}
      </dl>
      {nft.details && (
        <p className="text-xs">
          Metadados ilustrativos da demonstração; nenhuma transação é realizada na blockchain.
        </p>
      )}
    </div>
  );
}
