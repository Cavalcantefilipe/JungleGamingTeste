import type { Cart, Nft, Order, OrderStatus, Quote, User, Wallet } from '@/contracts';

export interface PasswordRecord {
  salt: string;
  hash: string;
}

export interface StoredUser extends User {
  ensName: string;
  walletNickname: string;
  password: PasswordRecord;
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface StoredWallet extends Wallet {
  userId: string;
}

export interface StoredQuote extends Quote {
  createdAt: string;
}

export interface IdempotencyRecord {
  payloadHash: string;
  orderId: string;
}

export interface LoginAttempts {
  count: number;
  firstAt: string;
}

export interface ScheduledTransition {
  orderId: string;
  status: OrderStatus;
  dueAt: string;
  declineReason?: string;
}

export interface MockDb {
  users: StoredUser[];
  sessions: StoredSession[];
  nfts: Nft[];
  favorites: Record<string, string[]>;
  carts: Cart[];
  quotes: StoredQuote[];
  orders: Order[];
  idempotency: Record<string, IdempotencyRecord>;
  wallets: StoredWallet[];
  secondaryWalletSameAsPrimary: Record<string, boolean>;
  loginAttempts: Record<string, LoginAttempts>;
  scheduledTransitions: ScheduledTransition[];
}

export type SeedName = 'default' | 'empty';
