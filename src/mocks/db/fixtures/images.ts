const artworkNames = [
  'emerald',
  'sage',
  'neon',
  'sage',
  'sage',
  'neon',
  'golden',
  'golden',
  'golden',
];

export function createArtwork(index: number): string {
  return `/images/nfts/${artworkNames[index % artworkNames.length] ?? 'emerald'}-800.webp`;
}
