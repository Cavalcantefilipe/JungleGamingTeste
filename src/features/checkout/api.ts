import { orderSchema, type CreateOrderInput } from '@/contracts/order';
import { walletConnectionSchema, type WalletConnectInput } from '@/contracts/wallet';
import { apiRequest } from '@/lib/http';

export function connectWallet(input: WalletConnectInput) {
  return apiRequest(walletConnectionSchema, {
    method: 'POST',
    url: '/wallet-session/connect',
    data: input,
  });
}
export function createOrder(input: CreateOrderInput, key: string) {
  return apiRequest(orderSchema, {
    method: 'POST',
    url: '/orders',
    data: input,
    headers: { 'Idempotency-Key': key },
  });
}
