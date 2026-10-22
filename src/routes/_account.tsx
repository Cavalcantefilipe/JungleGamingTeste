import { createFileRoute, Outlet } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';

export const Route = createFileRoute('/_account')({
  beforeLoad: ({ location }) => {
    requireAuth({ location });
  },
  staticData: { requiresAuth: true },
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-10 xl:px-0">
      <Outlet />
    </section>
  );
}
