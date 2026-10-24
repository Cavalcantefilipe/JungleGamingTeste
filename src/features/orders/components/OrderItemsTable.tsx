import type { Order } from '@/contracts/order';
import { OrderItemRow } from '@/features/orders/components/OrderItemRow';

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
          <OrderItemRow key={`${item.nftId}:${item.editionId}`} item={item} />
        ))}
      </tbody>
    </table>
  );
}
