import { NFT_CATEGORIES, NFT_NETWORKS, type Nft } from '@/contracts/nft';

import { createArtwork } from './images';

const names = [
  'Emerald Ape #042',
  'Sage Nomad #009',
  'Neon Vessel #552',
  'Cosmic Bloom #118',
  'Violet Nomad #314',
  'Ivory Baron #088',
  'Golden Beat #207',
  'Golden Signal #160',
  'Golden Frequency #071',
];
const prices = [
  '1.19',
  '8.34',
  '5.37',
  '2.48',
  '3.15',
  '0.89',
  '6.72',
  '4.2',
  '1.65',
  '0.02',
  '12.3',
];

function createNft(index: number): Nft {
  const id = `nft-${String(index + 1).padStart(3, '0')}`;
  const name = names[index % names.length] ?? 'Kurio Ape';
  return {
    id,
    slug: id,
    name: index < 9 ? name : `${name.split(' #')[0] ?? name} #${String(100 + index)}`,
    tokenId: String(42 + index),
    collection: index % 4 === 0 ? 'Kurio Editions' : 'Kurio Apes',
    category: NFT_CATEGORIES[index % 9] ?? 'arte-digital',
    network: NFT_NETWORKS[Math.floor(index / 3) % 3] ?? 'ethereum',
    price: prices[index % prices.length] ?? '1.19',
    ...(index % 4 === 0 ? { compareAtPrice: '12.3', rarity: 'raro' as const } : {}),
    rating: { average: 4.8, count: 19 + index },
    description:
      'Uma expressão única de identidade e cultura digital. Arte original da coleção Kurio, criada para quem enxerga além do agora. Cada edição conecta você a uma comunidade de colecionadores.',
    attributes: [
      { label: 'Coleção', value: 'Kurio Apes' },
      { label: 'Estilo', value: index % 2 === 0 ? 'Óculos vintage' : 'Explorador' },
      { label: 'Origem', value: 'Arte digital' },
    ],
    images: [
      { src: createArtwork(index), alt: `Ilustração de ${name}`, width: 600, height: 600 },
      { src: createArtwork(index + 1), alt: `Variação de ${name}`, width: 600, height: 600 },
    ],
    editions: [
      { id: `${id}-10`, label: '1/10', available: 10, max: 10 },
      { id: `${id}-1`, label: '1/1', available: index % 3 === 0 ? 0 : 1, max: 1 },
      { id: `${id}-50`, label: '1/50', available: 35, max: 50 },
      { id: `${id}-open`, label: 'aberta', available: 99, max: null },
    ],
    badges: index % 2 === 0 ? ['featured', 'new'] : ['limited', 'trending'],
    listedAt: new Date(Date.UTC(2026, 9, 22, 12, -index)).toISOString(),
    version: 1,
  };
}

export function createNfts(): Nft[] {
  return Array.from({ length: 48 }, (_, index) => createNft(index));
}
