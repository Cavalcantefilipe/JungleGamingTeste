import { orderSchema } from '@/contracts/order';
import { apiRequest } from '@/lib/http';

export function getOrder(id: string, signal?: AbortSignal) {
  return apiRequest(orderSchema, {
    url: `/orders/${encodeURIComponent(id)}`,
    ...(signal ? { signal } : {}),
  });
}
