import { useNavigate, useSearch } from '@tanstack/react-router';

export function useDetailNavigation() {
  const search = useSearch({ from: '/nfts/$nftId' });
  const navigate = useNavigate({ from: '/nfts/$nftId' });
  return {
    ...search,
    setTab: (tab: string) => {
      void navigate({
        search: { ...search, tab: tab === 'reviews' ? 'reviews' : 'details' },
        resetScroll: false,
      });
    },
    setPage: (reviewPage: number) => {
      void navigate({ search: { tab: 'reviews', reviewPage }, resetScroll: false });
    },
  };
}
