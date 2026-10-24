import { authHandlers } from '@/mocks/handlers/auth';
import { cartHandlers } from '@/mocks/handlers/cart';
import { contentHandlers } from '@/mocks/handlers/content';
import { favoriteHandlers } from '@/mocks/handlers/favorites';
import { nftHandlers } from '@/mocks/handlers/nfts';
import { orderHandlers } from '@/mocks/handlers/orders';
import { profileHandlers } from '@/mocks/handlers/profile';
import { quoteHandlers } from '@/mocks/handlers/quote';
import { walletSessionHandlers } from '@/mocks/handlers/wallet-session';
import { walletHandlers } from '@/mocks/handlers/wallets';
import { realtimeHandlers } from '@/mocks/socket/server';

export const handlers = [
  ...realtimeHandlers,
  ...authHandlers,
  ...contentHandlers,
  ...nftHandlers,
  ...favoriteHandlers,
  ...cartHandlers,
  ...quoteHandlers,
  ...orderHandlers,
  ...profileHandlers,
  ...walletHandlers,
  ...walletSessionHandlers,
];
