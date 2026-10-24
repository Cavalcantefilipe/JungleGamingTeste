import type { NftImage } from '@/contracts';

const ART_NAMES = [
  'emerald-ape',
  'sage-nomad',
  'ivory-baron',
  'sage-nomad',
  'sage-nomad',
  'ivory-baron',
  'golden-beat',
  'golden-beat',
  'golden-beat',
  'emerald-ape',
  'ivory-baron',
  'sage-nomad',
];
const ART_SIZE = 900;

export function artImage(index: number, alt: string): NftImage {
  const name = ART_NAMES[index % ART_NAMES.length] ?? 'emerald-ape';
  return { src: `/images/figma/${name}.webp`, alt, width: ART_SIZE, height: ART_SIZE };
}

export const HERO_IMAGE: NftImage = {
  src: '/images/figma/emerald-ape.webp',
  alt: 'Macaco estilizado de óculos escuros e jaqueta verde, mascote da Kurio',
  width: 900,
  height: 900,
};
