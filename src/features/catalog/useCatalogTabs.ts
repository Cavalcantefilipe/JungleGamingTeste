import { NFT_TABS, type NftTab } from '@/contracts/nft';

import type { KeyboardEvent } from 'react';

export function useCatalogTabs(change: (tab: NftTab) => void) {
  return (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const positions: Record<string, number> = {
      ArrowRight: (index + 1) % NFT_TABS.length,
      ArrowLeft: (index + NFT_TABS.length - 1) % NFT_TABS.length,
      Home: 0,
      End: NFT_TABS.length - 1,
    };
    const nextIndex = positions[event.key];
    if (nextIndex === undefined) return;
    const nextTab = NFT_TABS[nextIndex];
    if (!nextTab) return;
    event.preventDefault();
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
    change(nextTab);
  };
}
