import type { MockDb, ScheduledTransition } from '../db/schema';
import type { Order } from '@/contracts';

export function scheduleOrderTransition(db: MockDb, transition: ScheduledTransition): MockDb {
  const others = db.scheduledTransitions.filter((item) => item.orderId !== transition.orderId);
  return { ...db, scheduledTransitions: [...others, transition] };
}

export function applyDueTransitions(db: MockDb, now: Date): { db: MockDb; applied: Order[] } {
  const due = db.scheduledTransitions.filter((item) => new Date(item.dueAt) <= now);
  if (due.length === 0) return { db, applied: [] };

  const applied: Order[] = [];
  const orders = db.orders.map((order) => {
    const transition = due.find((item) => item.orderId === order.id);
    if (!transition || order.status !== 'pending') return order;
    const updated: Order = {
      ...order,
      status: transition.status,
      updatedAt: now.toISOString(),
      version: order.version + 1,
      ...(transition.declineReason ? { declineReason: transition.declineReason } : {}),
    };
    applied.push(updated);
    return updated;
  });
  const scheduledTransitions = db.scheduledTransitions.filter((item) => !due.includes(item));
  return { db: { ...db, orders, scheduledTransitions }, applied };
}
