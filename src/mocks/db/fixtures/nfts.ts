import {
  NFT_CATEGORIES,
  NFT_CATEGORY_LABELS,
  NFT_NETWORK_LABELS,
  NFT_NETWORKS,
  type EthAmount,
  type Nft,
  type NftBadge,
  type NftEdition,
} from '@/contracts';

import { artImage } from './images';

export const NFT_COUNT = 48;

const BASE_NAMES = [
  'Emerald Ape',
  'Sage Nomad',
  'Neon Vessel',
  'Cosmic Bloom',
  'Violet Nomad',
  'Ivory Baron',
  'Golden Beat',
  'Golden Signal',
  'Golden Frequency',
  'Amber Oracle',
  'Crimson Drift',
  'Silver Echo',
  'Obsidian Muse',
  'Lunar Pilot',
  'Copper Totem',
  'Jade Courier',
];

const FIGMA_PRICES: { price: EthAmount; compareAtPrice?: EthAmount; number: number }[] = [
  { price: '1.19', number: 42 },
  { price: '1.69', number: 9 },
  { price: '1.99', compareAtPrice: '2.29', number: 552 },
  { price: '1.29', number: 118 },
  { price: '1.39', number: 314 },
  { price: '1.79', number: 88 },
  { price: '0.99', number: 207 },
  { price: '0.39', number: 160 },
  { price: '0.59', number: 71 },
];

const COLLECTIONS = ['Kurio Apes', 'Kurio Editions', 'GreenMint Originals'];

const ATTRIBUTE_SETS = [
  ['Óculos', 'Esmeralda', 'Moro'],
  ['Chapéu', 'Safira', 'Neon'],
  ['Fones', 'Âmbar', 'Lunar'],
  ['Jaqueta', 'Jade', 'Clássico'],
];

const CATEGORY_SEQUENCE = [
  0, 0, 1, 2, 0, 3, 4, 0, 5, 1, 6, 0, 7, 2, 8, 0, 1, 3, 0, 4, 5, 0, 2, 6, 1, 0, 7, 3, 0, 8, 4, 0, 1,
  2, 5, 0, 6, 3, 0, 7, 1, 4, 0, 8, 2, 5, 0, 1,
];
const NETWORK_SEQUENCE = [0, 0, 1, 0, 2, 0, 1, 0, 0, 2, 1, 0];
const SOLD_OUT_SINGLE_EDITION = new Set([5, 9, 13, 21, 37]);
const PRICE_SPREAD = 1229;
const MIN_PRICE_CENTS = 2;
const LISTED_AT_START = Date.UTC(2026, 6, 29, 12, 0, 0);
const DAY_MS = 24 * 60 * 60 * 1000;

function at<T>(list: readonly T[], index: number): T {
  const item = list[index % list.length];
  if (item === undefined) throw new Error('lista de fixtures vazia');
  return item;
}

function priceFor(index: number): { price: EthAmount; compareAtPrice?: EthAmount } {
  const figma = FIGMA_PRICES[index];
  if (figma) return figma;
  const cents = MIN_PRICE_CENTS + ((index * 379) % PRICE_SPREAD);
  return { price: (cents / 100).toFixed(2) };
}

function numberFor(index: number): number {
  return FIGMA_PRICES[index]?.number ?? ((index * 53) % 900) + 100;
}

function editionsFor(index: number): NftEdition[] {
  const singleAvailable = SOLD_OUT_SINGLE_EDITION.has(index) ? 0 : 1;
  const all: NftEdition[] = [
    {
      id: `ed_${index + 1}_10`,
      label: '1/10',
      available: index === 20 ? 0 : 1 + (index % 5),
      max: 10,
    },
    { id: `ed_${index + 1}_1`, label: '1/1', available: singleAvailable, max: 1 },
    { id: `ed_${index + 1}_50`, label: '1/50', available: 12 + (index % 30), max: 50 },
    { id: `ed_${index + 1}_open`, label: 'aberta', available: 99, max: null },
  ];
  return index % 3 === 1 ? all.slice(0, 3) : all;
}

function badgesFor(index: number): NftBadge[] {
  const badges: NftBadge[] = [];
  if (index === 0) badges.push('featured');
  if (index === 0 || index % 8 === 1) badges.push('limited');
  if (index < 9) badges.push('new');
  if (index % 5 === 2) badges.push('trending');
  return badges;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildNft(index: number): Nft {
  const number = numberFor(index);
  const name = `${at(BASE_NAMES, index)} #${String(number).padStart(3, '0')}`;
  const category = at(NFT_CATEGORIES, at(CATEGORY_SEQUENCE, index));
  const network = at(NFT_NETWORKS, at(NETWORK_SEQUENCE, index));
  const collection = at(COLLECTIONS, index % COLLECTIONS.length);
  const editions = editionsFor(index);
  const firstEdition = at(editions, 0);
  return {
    id: `nft_${String(index + 1).padStart(3, '0')}`,
    slug: slugify(name),
    name,
    tokenId: `#${String(number).padStart(4, '0')}`,
    collection,
    category,
    network,
    ...priceFor(index),
    ...(index % 6 === 3 ? { rarity: 'raro' as const } : {}),
    rating: { average: 3.8 + ((index * 7) % 12) / 10, count: 3 + ((index * 11) % 120) },
    description: `${name} é um colecionável digital ${firstEdition.label} finalizado à mão da coleção ${collection}, verificado na ${NFT_NETWORK_LABELS[network]}. Uma obra de ${NFT_CATEGORY_LABELS[category].toLowerCase()} com identidade própria.`,
    attributes: at(ATTRIBUTE_SETS, index).map((value, position) => ({
      label: ['Acessório', 'Pedra', 'Estilo'][position] ?? 'Atributo',
      value,
    })),
    images: [0, 1, 2, 3].map((position) => artImage(index, `${name}, vista ${position + 1}`)),
    editions,
    badges: badgesFor(index),
    listedAt: new Date(LISTED_AT_START - index * DAY_MS).toISOString(),
    version: 1,
  };
}

export function buildNfts(): Nft[] {
  return Array.from({ length: NFT_COUNT }, (_, index) => buildNft(index));
}

export function createNftFixture(index: number, overrides: Partial<Nft> = {}): Nft {
  return { ...buildNft(index), ...overrides };
}
