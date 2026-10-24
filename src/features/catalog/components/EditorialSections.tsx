import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentQuery } from '@/features/catalog/useContentQuery';

import { EditorialContent } from './EditorialContent';

export function EditorialSections() {
  const query = useContentQuery();
  if (query.isError)
    return (
      <section aria-label="Conteúdo editorial" className="mt-24">
        <ErrorState
          error={query.error}
          retry={() => {
            void query.refetch();
          }}
          title="Conteúdo editorial indisponível"
          retryLabel="Recarregar conteúdo editorial"
        />
      </section>
    );
  if (!query.data)
    return (
      <div className="mt-24 space-y-24">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  return <EditorialContent content={query.data} />;
}
