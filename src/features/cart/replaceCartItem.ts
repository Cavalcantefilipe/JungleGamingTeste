import type { Cart } from '@/contracts/cart';

export function replaceCartItem(
  cart: Cart | undefined,
  id: string,
  updates: Partial<Cart['items'][number]>,
) {
  return cart
    ? {
        ...cart,
        items: cart.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      }
    : cart;
}
