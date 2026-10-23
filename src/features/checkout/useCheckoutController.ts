import { useState } from 'react';

import type { Session } from '@/contracts/auth';
import type { Cart } from '@/contracts/cart';
import type { Profile } from '@/contracts/profile';
import type { Wallet, Wallets } from '@/contracts/wallet';
import { readCartCoupon } from '@/features/cart/coupon-store';
import { readPendingOrder } from '@/features/orders/pending-order';

import { getWalletIdentity } from './getWalletIdentity';
import { useCheckoutSubmission } from './useCheckoutSubmission';
import { useCheckoutWallet } from './useCheckoutWallet';
import { useCreateOrder } from './useCreateOrder';
import { useQuoteReview } from './useQuoteReview';
import { useWalletConnection } from './useWalletConnection';

export interface CheckoutInput {
  session: Session;
  profile: Profile;
  cart: Cart;
  wallets: Wallets;
  initialWallet: Wallet;
}

export function useCheckoutController({
  session,
  profile,
  cart,
  wallets,
  initialWallet,
}: CheckoutInput) {
  const walletForm = useCheckoutWallet(session, profile, wallets, initialWallet);
  const { selected, form, storageError } = walletForm;
  const [couponCode] = useState(() => readCartCoupon(cart.scope));
  const review = useQuoteReview(cart, selected, couponCode);
  const connection = useWalletConnection(session.token, getWalletIdentity(selected));
  const create = useCreateOrder(session);
  const pending = readPendingOrder(session.user.id);
  const submit = useCheckoutSubmission({
    form,
    review,
    connection,
    create,
    wallet: selected,
    couponCode,
    storageError,
  });
  const select = (wallet: Wallet) => {
    walletForm.select(wallet);
    connection.reset();
  };
  return { ...walletForm, select, review, connection, create, pending, submit };
}
