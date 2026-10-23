import { useRouterState } from '@tanstack/react-router';

export function useShareDestinations() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const url = encodeURIComponent(`${window.location.origin}${pathname}`);
  return [
    {
      icon: 'linkedin',
      label: 'Compartilhar no LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    },
    { icon: 'mail', label: 'Compartilhar por e-mail', href: `mailto:?body=${url}` },
    {
      icon: 'twitter',
      label: 'Compartilhar no X',
      href: `https://twitter.com/intent/tweet?url=${url}`,
    },
  ] as const;
}
