import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { nftListResponseSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';
import { formatEth } from '@/lib/money';
import { queryKeys } from '@/lib/query-keys';

export const Route = createFileRoute('/')({ component: HomePage });

function HomePage() {
  const catalog = useQuery({
    queryKey: queryKeys.nfts.list({}),
    queryFn: ({ signal }) => http.get('/nfts', { signal }).then(parseWith(nftListResponseSchema)),
  });

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-10">
      <h1 className="text-display text-foreground">Kurio</h1>
      <p className="text-body text-text-secondary">Marketplace de NFTs</p>
      {catalog.isPending && <p className="text-body text-text-secondary">Carregando catálogo…</p>}
      {catalog.isError && (
        <p className="text-body text-error">Não foi possível carregar o catálogo.</p>
      )}
      {catalog.data && (
        <ul className="mt-8 grid grid-cols-3 gap-6">
          {catalog.data.items.map((nft) => (
            <li key={nft.id} className="rounded-card bg-surface-card p-4">
              <p className="text-body font-bold text-foreground">{nft.name}</p>
              <p className="text-body font-bold text-text-accent">{formatEth(nft.price)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
