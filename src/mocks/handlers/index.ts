import { authHandlers } from './auth';
import { cartHandlers } from './cart';
import { favoriteHandlers } from './favorites';
import { nftHandlers } from './nfts';
import { orderHandlers } from './orders';
import { profileHandlers } from './profile';
import { quoteHandlers } from './quote';
import { walletHandlers } from './wallets';

import type { HandlerContext } from './context';

export { noopEventPublisher, type HandlerContext, type MockEventPublisher } from './context';

export function createHandlers(context: HandlerContext) {
  return [
    ...authHandlers(context),
    ...nftHandlers(context),
    ...favoriteHandlers(context),
    ...cartHandlers(context),
    ...quoteHandlers(context),
    ...orderHandlers(context),
    ...profileHandlers(context),
    ...walletHandlers(context),
  ];
}
