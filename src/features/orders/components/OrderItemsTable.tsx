import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Order } from '@/contracts/order';
import { formatEth } from '@/lib/money';

export function OrderItemsTable({ order }: { order: Order }) {
  return (
    <table
      data-testid="order-items"
      className="w-full border-collapse text-left text-xs md:text-sm"
    >
      <caption className="sr-only">NFTs comprados</caption>
      <thead>
        <tr className="border-b border-border-soft text-text-secondary">
          <th scope="col" className="pt-0 pb-3 font-normal">
            NFTs
          </th>
          <th scope="col" className="px-2 pt-0 pb-3 text-center font-normal">
            Edições
          </th>
          <th scope="col" className="pt-0 pb-3 text-right font-normal">
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
                <span className="min-w-0">
                  <strong className="block text-xs leading-4 font-bold md:text-sm">
                    {item.name}
                  </strong>
                  <span className="text-xs text-text-secondary">Edição {item.editionLabel}</span>
                </span>
              </div>
            </td>
            <td className="px-2 text-center">{item.quantity}</td>
            <td className="text-right text-base leading-4 font-bold text-text-accent md:text-lg">
              {formatEth(item.lineTotal)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
