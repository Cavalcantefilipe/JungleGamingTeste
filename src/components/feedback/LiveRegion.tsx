import { useSyncExternalStore } from 'react';

import { liveAnnouncement } from './announce';

export function LiveRegion() {
  const message = useSyncExternalStore(liveAnnouncement.subscribe, liveAnnouncement.getSnapshot);
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
