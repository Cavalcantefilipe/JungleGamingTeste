import { useState } from 'react';

import type { Session } from '@/contracts/auth';
import type { Cart } from '@/contracts/cart';
import type { Profile } from '@/contracts/profile';
import type { Wallet, Wallets } from '@/contracts/wallet';
import { readCartCoupon } from '@/features/cart/coupon-store';
import { getWalletIdentity } from '@/features/checkout/getWalletIdentity';
import { useCheckoutSubmission } from '@/features/checkout/useCheckoutSubmission';
import { useCheckoutWallet } from '@/features/checkout/useCheckoutWallet';
import { useCreateOrder } from '@/features/checkout/useCreateOrder';
import { useQuoteReview } from '@/features/checkout/useQuoteReview';
import { useWalletConnection } from '@/features/checkout/useWalletConnection';
import { readPendingOrder } from '@/features/orders/pending-order';

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
