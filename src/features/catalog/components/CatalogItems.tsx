import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { NftGrid } from '@/features/catalog/components/NftGrid';
import type { useCatalogQuery } from '@/features/catalog/queries';

export function CatalogItems({
  query,
  clear,
}: {
  query: ReturnType<typeof useCatalogQuery>;
  clear: () => void;
}) {
  if (query.isError)
    return (
      <ErrorState
        error={query.error}
        retry={() => {
          void query.refetch();
        }}
      />
    );
  if (query.data?.total === 0)
    return (
      <EmptyState
        title="Nenhum NFT encontrado"
        description="Experimente combinar outros filtros para encontrar sua próxima coleção."
        action={<Button onClick={clear}>Limpar filtros</Button>}
      />
    );
  return <NftGrid {...(query.data ? { items: query.data.items } : {})} loading={query.isPending} />;
}
