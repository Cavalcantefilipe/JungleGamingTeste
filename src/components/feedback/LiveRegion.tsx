import { useAnnouncement } from './live-region';

export function LiveRegion() {
  const { message, version } = useAnnouncement();
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only" data-version={version}>
      {message}
    </div>
  );
}
