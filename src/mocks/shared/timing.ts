import type { Order } from '@/contracts/order';
import type { MockDb } from '@/mocks/db/schema';

export function scheduleOrderTransition(
  db: MockDb,
  orderId: string,
  status: 'confirmed' | 'declined',
  dueAt: number,
): MockDb {
  return {
    ...db,
    scheduledTransitions: [
      ...db.scheduledTransitions.filter((entry) => entry.orderId !== orderId),
      { orderId, status, dueAt },
    ],
  };
}

function confirmPurchase(db: MockDb, order: Order): MockDb {
  const cartKey = `user:${order.userId}`;
  const cart = db.carts[cartKey];
  const items = cart?.items.flatMap((item) => {
    const purchased = order.items.find(
      (entry) => entry.nftId === item.nftId && entry.editionId === item.editionId,
    );
    const quantity = item.quantity - (purchased?.quantity ?? 0);
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
  return {
    ...db,
    nfts: db.nfts.map((nft) => {
      const purchased = order.items.filter((item) => item.nftId === nft.id);
      if (!purchased.length) return nft;
      return {
        ...nft,
        version: nft.version + 1,
        editions: nft.editions.map((edition) => ({
          ...edition,
          available:
            edition.available -
            purchased
              .filter((item) => item.editionId === edition.id)
              .reduce((sum, item) => sum + item.quantity, 0),
        })),
      };
    }),
    carts: cart && items ? { ...db.carts, [cartKey]: { ...cart, items } } : db.carts,
  };
}

function hasStock(db: MockDb, order: Order): boolean {
  return order.items.every((item) => {
    const edition = db.nfts
      .find((nft) => nft.id === item.nftId)
      ?.editions.find((entry) => entry.id === item.editionId);
    const total = order.items
      .filter((entry) => entry.nftId === item.nftId && entry.editionId === item.editionId)
      .reduce((sum, entry) => sum + entry.quantity, 0);
    return Boolean(edition && edition.available >= total);
  });
}
export function applyDueTransitions(db: MockDb, now = Date.now()): MockDb {
  return db.scheduledTransitions
    .filter((entry) => entry.dueAt <= now)
    .reduce((state, transition) => {
      const order = state.orders.find((entry) => entry.id === transition.orderId);
      if (order?.status !== 'pending')
        return {
          ...state,
          scheduledTransitions: state.scheduledTransitions.filter(
            (entry) => entry.orderId !== transition.orderId,
          ),
        };
      const unavailable = transition.status === 'confirmed' && !hasStock(state, order);
      const status = unavailable ? 'declined' : transition.status;
      const next = status === 'confirmed' ? confirmPurchase(state, order) : state;
      const transactionRef = `0x${order.id.replaceAll('-', '').padEnd(64, '0')}`;
      return {
        ...next,
        orders: next.orders.map((entry) =>
          entry.id !== order.id
            ? entry
            : {
                ...entry,
                status,
                version: entry.version + 1,
                updatedAt: new Date(now).toISOString(),
                transactionRef,
                explorerUrl: `https://etherscan.io/tx/${transactionRef}`,
                ...(status === 'declined'
                  ? {
                      declineReason: unavailable
                        ? 'A edição não está mais disponível. Nenhum item foi comprado.'
                        : 'A transação foi recusada pela rede simulada.',
                    }
                  : {}),
              },
        ),
        scheduledTransitions: next.scheduledTransitions.filter(
          (entry) => entry.orderId !== order.id,
        ),
      };
    }, db);
}
