import { Skeleton } from '@/components/ui/skeleton';
import type { QuoteItem } from '@/contracts/quote';
import { cn } from '@/lib/cn';
import { formatEth } from '@/lib/money';

export function CartLineTotal({ quote }: { quote: QuoteItem | undefined }) {
  const lineTotal = quote ? formatEth(quote.lineTotal) : undefined;
  return (
    <td className="absolute bottom-[18px] left-3 whitespace-nowrap min-[390px]:left-[109px] md:static md:table-cell md:px-2">
      <div
        className={cn(
          'text-[18px] leading-4 font-bold text-text-accent md:text-base',
          (lineTotal?.length ?? 0) > 9 && 'text-[15px]',
        )}
      >
        {lineTotal ?? <Skeleton className="h-5 w-20" />}
      </div>
    </td>
  );
}
