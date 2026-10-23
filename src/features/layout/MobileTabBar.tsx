import { useRouterState } from '@tanstack/react-router';

import { useSession } from '@/features/auth/session-store';
import { useCartQuery } from '@/features/cart/queries';

import { MobileNavigationLinks } from './MobileNavigationLinks';

export function MobileTabBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const session = useSession();
  const cart = useCartQuery();
  const quantity = cart.data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  if (pathname.startsWith('/nfts/') || ['/cart', '/checkout'].includes(pathname)) return null;
  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-0 bottom-0 isolate z-30 grid min-h-[95px] grid-cols-[22.222%_12.56%_30.676%_14.734%_15.459%] items-center pt-1 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <img
        src="/images/ui/mobile-tab-background.svg"
        alt=""
        aria-hidden="true"
        width={414}
        height={95}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      />
      <MobileNavigationLinks authenticated={Boolean(session)} quantity={quantity} />
    </nav>
  );
}
