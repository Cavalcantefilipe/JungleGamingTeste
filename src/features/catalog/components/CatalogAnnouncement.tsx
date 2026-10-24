import { catalogMessages } from '@/features/catalog/messages';
import type { useCatalogQuery } from '@/features/catalog/queries';
import type { useCatalogAnnouncement } from '@/features/catalog/useCatalogAnnouncement';

export function CatalogAnnouncement({
  query,
  announcement,
}: {
  query: ReturnType<typeof useCatalogQuery>;
  announcement: ReturnType<typeof useCatalogAnnouncement>;
}) {
  const count =
    query.isSuccess && !query.isPlaceholderData
      ? catalogMessages.resultsFound(query.data.total)
      : '';
  const message = announcement.navigating || query.isFetching ? catalogMessages.updating : count;
  return (
    <>
      {!announcement.enabled && <div className="sr-only">{count}</div>}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement.enabled ? message : ''}
      </div>
    </>
  );
}
