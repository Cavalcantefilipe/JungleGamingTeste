import { z } from 'zod';

import { userSchema } from '@/contracts/auth';
import { cartSchema } from '@/contracts/cart';
import { nftSchema } from '@/contracts/nft';
import { orderSchema } from '@/contracts/order';
import { profileSchema } from '@/contracts/profile';
import { quoteSchema } from '@/contracts/quote';
import { walletsSchema } from '@/contracts/wallet';
import { passwordHashSchema } from '@/mocks/shared/password';

export const mockUserSchema = z.object({
  user: userSchema,
  password: passwordHashSchema,
  profile: profileSchema,
});
export const mockDbSchema = z.object({
  users: z.array(mockUserSchema),
  sessions: z.array(z.object({ token: z.string(), userId: z.string(), expiresAt: z.string() })),
  nfts: z.array(nftSchema),
  favorites: z.record(z.string(), z.array(z.string())),
  carts: z.record(z.string(), cartSchema),
  quotes: z.record(z.string(), quoteSchema),
  orders: z.array(orderSchema),
  idempotency: z.record(z.string(), z.object({ hash: z.string(), orderId: z.string() })),
  wallets: z.record(z.string(), walletsSchema),
  walletConnections: z.record(z.string(), z.string()),
  loginAttempts: z.record(z.string(), z.object({ count: z.number(), since: z.number() })),
  scheduledTransitions: z.array(
    z.object({ orderId: z.string(), status: z.enum(['confirmed', 'declined']), dueAt: z.number() }),
  ),
});
export type MockDb = z.infer<typeof mockDbSchema>;
export type MockUser = z.infer<typeof mockUserSchema>;
