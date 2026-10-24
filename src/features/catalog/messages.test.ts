import { expect, it } from 'vitest';

import { catalogMessages } from '@/features/catalog/messages';

it.each([
  [0, '0 NFTs encontrados'],
  [1, '1 NFT encontrado'],
  [2, '2 NFTs encontrados'],
])('anuncia a contagem %i com concordância correta', (count, expected) => {
  expect(catalogMessages.resultsFound(count)).toBe(expected);
});
