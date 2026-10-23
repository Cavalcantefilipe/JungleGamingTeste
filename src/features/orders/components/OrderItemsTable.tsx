import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Order } from '@/contracts/order';
import { formatEth } from '@/lib/money';

export function OrderItemsTable({ order }: { order: Order }) {
  return (
    <table
      data-testid="order-items"
      className="w-full table-fixed border-collapse text-left text-xs md:table-auto md:text-base"
    >
      <caption className="sr-only">NFTs comprados</caption>
      <thead>
        <tr className="border-b border-border-soft text-foreground">
          <th scope="col" className="w-[48%] pt-0 pb-3 font-bold md:w-auto">
            NFTs
          </th>
          <th
            scope="col"
            className="w-[20%] px-1 pt-0 pb-3 text-center font-bold md:w-auto md:px-2"
          >
            Edições
          </th>
          <th scope="col" className="pt-0 pb-3 text-right font-bold">
            Subtotal
          </th>
        </tr>
      </thead>
      <tbody>
        {order.items.map((item) => (
          <tr key={`${item.nftId}:${item.editionId}`} className="">
            <td className="py-2">
              <div className="flex items-center gap-2">
                <ArtworkImage
                  sizes="(min-width: 768px) 70px, 48px"
                  src={item.image.src}
                  alt=""
                  width={70}
                  height={70}
                  className="size-12 shrink-0 rounded-control object-cover md:size-[70px]"
                />
                <span className="min-w-0 wrap-anywhere">
                  <strong className="block text-xs leading-4 font-bold md:text-base">
                    {item.name}
                  </strong>
                  <span className="text-xs text-text-secondary md:text-sm">
                    Edição {item.editionLabel}
                  </span>
                </span>
              </div>
            </td>
            <td className="px-2 text-center text-xs text-text-secondary md:text-sm">
              (x {item.quantity})
            </td>
            <td className="text-right text-sm leading-4 font-bold wrap-anywhere text-text-accent min-[390px]:text-base md:text-lg">
              {formatEth(item.lineTotal)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
