import { AccountSidebar } from '@/features/account/components/AccountSidebar';

import type { ReactNode } from 'react';

export function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-7 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[310px_minmax(0,1fr)]">
      <AccountSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
