import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { nftListResponseSchema } from '@/contracts/nft';
import { apiRequest } from '@/lib/http';

export const Route = createFileRoute('/')({ component: Home });
function Home() {
  const query = useQuery({
    queryKey: ['nfts', 'list'],
    queryFn: ({ signal }) => apiRequest(nftListResponseSchema, { url: '/nfts', signal }),
  });
  return (
    <section>
      <h1 className="text-display">Marketplace de NFTs</h1>
      <p>{query.isPending ? 'Carregando…' : `${query.data?.total ?? 0} NFTs disponíveis`}</p>
    </section>
  );
}
