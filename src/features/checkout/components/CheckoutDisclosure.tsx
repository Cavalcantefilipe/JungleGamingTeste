import { ChevronDownIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function CheckoutDisclosure({
  title,
  invalid = false,
  children,
}: {
  title: string;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  const desktop = useMediaQuery('(min-width: 768px)');
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const open = desktop || expanded || invalid;
  return (
    <section>
      <h2 className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            setExpanded((value) => !value);
          }}
          className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-border text-body font-bold text-text-accent hover:text-primary"
        >
          {title}
          <ChevronDownIcon aria-hidden className="size-4" />
        </button>
      </h2>
      <div id={id} hidden={!open} className="pt-4 md:pt-0">
        {children}
      </div>
    </section>
  );
}
