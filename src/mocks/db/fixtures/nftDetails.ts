import { NFT_NETWORK_LABELS, type Nft } from '@/contracts/nft';

export function createNftDetails(
  name: string,
  collection: string,
  network: Nft['network'],
  index: number,
) {
  const networkName = NFT_NETWORK_LABELS[network];
  return {
    description: `Um colecionável digital finalizado à mão da coleção ${collection}, na ${networkName}, com arte desbloqueável e acesso para colecionadores.`,
    details: {
      paragraphs: [
        `${name} é uma obra digital finalizada à mão da coleção ${collection}. Cada atributo faz parte dos metadados do token na ${networkName}. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
        'A coleção inclui arte em alta resolução, acesso a lançamentos exclusivos e um registro de procedência. Nova Sato recebe 5% de direitos autorais nas vendas secundárias em mercados compatíveis, apoiando novos trabalhos da comunidade.',
      ],
      provenance: `Procedência na ${networkName} e metadados armazenados no IPFS.`,
      contract:
        network === 'solana'
          ? `KurioDemo${String(index + 1).padStart(4, '0')}`
          : `0x${(index + 1).toString(16).padStart(40, '0')}`,
      standard: network === 'solana' ? 'Metaplex' : 'ERC-721',
      creator: 'Nova Sato',
      royaltyPercent: 5,
    },
  };
}
