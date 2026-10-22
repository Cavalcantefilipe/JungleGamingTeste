import { useState } from 'react';

import type { Nft, NftEdition } from '@/contracts';

export interface PurchaseSelection {
  edition: NftEdition;
  quantity: number;
  selectEdition: (editionId: string) => void;
  setQuantity: (quantity: number) => void;
}

function defaultEdition(nft: Nft): NftEdition {
  const edition = nft.editions.find((candidate) => candidate.available > 0) ?? nft.editions[0];
  if (!edition) throw new Error(`NFT ${nft.id} sem edições`);
  return edition;
}

export function usePurchaseSelection(nft: Nft): PurchaseSelection {
  const [editionId, setEditionId] = useState(() => defaultEdition(nft).id);
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const edition =
    nft.editions.find((candidate) => candidate.id === editionId) ?? defaultEdition(nft);
  const quantity = Math.max(1, Math.min(requestedQuantity, Math.max(edition.available, 1)));

  return {
    edition,
    quantity,
    selectEdition: (nextId) => {
      setEditionId(nextId);
      setRequestedQuantity(1);
    },
    setQuantity: setRequestedQuantity,
  };
}
