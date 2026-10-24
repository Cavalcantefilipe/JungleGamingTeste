import {
  orderSchema,
  walletConnectionSchema,
  walletsSchema,
  type CreateOrderInput,
  type Order,
  type WalletConnectInput,
} from '@/contracts';
import { http, parseWith } from '@/lib/http';

export const checkoutApi = {
  wallets: (signal?: AbortSignal) =>
    http.get('/wallets', signal ? { signal } : {}).then(parseWith(walletsSchema)),
  connect: (input: WalletConnectInput) =>
    http.post('/wallet-session/connect', input).then(parseWith(walletConnectionSchema)),
  createOrder: (input: CreateOrderInput, idempotencyKey: string): Promise<Order> =>
    http
      .post('/orders', input, { headers: { 'Idempotency-Key': idempotencyKey } })
      .then(parseWith(orderSchema)),
  order: (id: string, signal?: AbortSignal) =>
    http.get(`/orders/${id}`, signal ? { signal } : {}).then(parseWith(orderSchema)),
};
