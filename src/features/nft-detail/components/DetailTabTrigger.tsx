import { TabsTrigger } from '@/components/ui/tabs';

import type { ReactNode } from 'react';

export function DetailTabTrigger({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="min-h-11 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-sm text-foreground after:hidden data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-text-accent md:text-[17px]"
    >
      {children}
    </TabsTrigger>
  );
}
