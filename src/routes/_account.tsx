import { createFileRoute, Outlet } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { AccountSidebar } from '@/features/profile/components/AccountSidebar';

export const Route = createFileRoute('/_account')({
  beforeLoad: ({ location }) => {
    requireAuth({ location });
  },
  staticData: { requiresAuth: true },
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <section className="mx-auto grid w-full max-w-[1200px] gap-6 px-6 py-8 lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-7 xl:px-0">
      <AccountSidebar />
      <div className="min-w-0">
        <Outlet />
      </div>
    </section>
  );
}
