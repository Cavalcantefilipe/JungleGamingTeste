import type { NftImage } from '@/contracts';

const ART_COUNT = 12;
const ART_SIZE = 600;

export function artImage(index: number, alt: string): NftImage {
  const number = String((index % ART_COUNT) + 1).padStart(2, '0');
  return { src: `/images/nfts/art-${number}.svg`, alt, width: ART_SIZE, height: ART_SIZE };
}

export const HERO_IMAGE: NftImage = {
  src: '/images/hero/ape-hero.svg',
  alt: 'Macaco estilizado de óculos escuros e jaqueta verde, mascote da Kurio',
  width: 900,
  height: 900,
};
