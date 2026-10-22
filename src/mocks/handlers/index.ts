import { realtimeHandlers } from '@/mocks/socket/server';

import { authHandlers } from './auth';
import { cartHandlers } from './cart';
import { contentHandlers } from './content';
import { favoriteHandlers } from './favorites';
import { nftHandlers } from './nfts';
import { orderHandlers } from './orders';
import { profileHandlers } from './profile';
import { quoteHandlers } from './quote';
import { walletSessionHandlers } from './wallet-session';
import { walletHandlers } from './wallets';

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
