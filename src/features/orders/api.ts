import { orderSchema } from '@/contracts/order';
import { ApiError } from '@/lib/errors';
import { apiRequest } from '@/lib/http';

export async function getOrder(userId: string, id: string, signal?: AbortSignal) {
  const order = await apiRequest(orderSchema, {
    url: `/orders/${encodeURIComponent(id)}`,
    userId,
    ...(signal ? { signal } : {}),
  });
  if (order.userId !== userId) throw new ApiError('FORBIDDEN', 403);
  return order;
}
