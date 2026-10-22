import { Link } from '@tanstack/react-router';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartQuery } from '@/features/cart/queries';
import { MobilePageHeader } from '@/features/layout/MobilePageHeader';

import { CartContent } from './CartContent';
import { CartRecommendations } from './CartRecommendations';

export function CartPage() {
  const query = useCartQuery();
  return (
    <>
      <MobilePageHeader title="Carrinho de NFTs" />
      <h1 className="mb-6 hidden text-xs text-text-secondary md:block">Carrinho de NFTs</h1>
      {query.isPending ? (
        <div aria-label="Carregando carrinho" className="space-y-4">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-[100px] w-full" />
          ))}
        </div>
      ) : query.isError ? (
        <ErrorState
          error={query.error}
          retry={() => {
            void query.refetch();
          }}
        />
      ) : !query.data.items.length ? (
        <EmptyState
          title="Seu carrinho está vazio"
          description="Encontre sua próxima peça de arte digital no mercado."
          action={
            <Button asChild>
              <Link to="/">Explorar NFTs</Link>
            </Button>
          }
        />
      ) : (
        <>
          <CartContent key={query.data.id} cart={query.data} />
          <CartRecommendations excludedIds={query.data.items.map((item) => item.nftId)} />
        </>
      )}
    </>
  );
}
