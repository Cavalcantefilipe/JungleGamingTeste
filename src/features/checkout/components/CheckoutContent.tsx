import { useState } from 'react';

import { applyFormError } from '@/components/forms/applyFormError';
import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Session } from '@/contracts/auth';
import type { Cart } from '@/contracts/cart';
import type { Profile } from '@/contracts/profile';
import type { Wallet, Wallets } from '@/contracts/wallet';
import { readCartCoupon } from '@/features/cart/coupon-store';
import { readCheckoutDraft } from '@/features/checkout/checkout-draft';
import { readPendingOrder } from '@/features/orders/pending-order';
import { ApiError, errorMessage } from '@/lib/errors';

import { checkoutMessages } from '../messages';
import { useCheckoutForm } from '../useCheckoutForm';
import { useCreateOrder } from '../useCreateOrder';
import { useQuoteReview } from '../useQuoteReview';
import { useWalletConnection } from '../useWalletConnection';
import { CollectorForm } from './CollectorForm';
import { OrderReview } from './OrderReview';
import { StaleQuoteBanner } from './StaleQuoteBanner';
import { SubmitOrderButton } from './SubmitOrderButton';
import { WalletNetworkPicker } from './WalletNetworkPicker';

export function CheckoutContent({
  session,
  profile,
  cart,
  wallets,
  initialWallet,
}: {
  session: Session;
  profile: Profile;
  cart: Cart;
  wallets: Wallets;
  initialWallet: Wallet;
}) {
  const [selectedId, setSelectedId] = useState(() =>
    readCheckoutDraft(session.user.id)?.useOtherWallet && wallets.secondary
      ? wallets.secondary.id
      : initialWallet.id,
  );
  const savedWallets = [wallets.primary, wallets.secondary].flatMap((wallet) =>
    wallet ? [wallet] : [],
  );
  const selected = savedWallets.find((wallet) => wallet.id === selectedId) ?? initialWallet;
  const { form, storageError } = useCheckoutForm(session, profile, selected);
  const [couponCode] = useState(() => readCartCoupon(cart.scope));
  const review = useQuoteReview(cart, selected, couponCode);
  const connection = useWalletConnection(
    session.token,
    JSON.stringify([selected.id, selected.address, selected.network, selected.walletType]),
  );
  const create = useCreateOrder(session);
  const pending = readPendingOrder(session.user.id);
  const select = (wallet: Wallet) => {
    setSelectedId(wallet.id);
    connection.reset();
    form.reset({
      ...form.getValues(),
      useOtherWallet: wallet.role === 'secondary',
      network: wallet.network,
      profileName: wallet.profileName,
      walletAddress: wallet.address,
      walletType: wallet.walletType,
      secondaryWallet: wallet.secondaryAddress ?? '',
      referralCode: wallet.referralCode ?? '',
    });
  };
  const submit = form.handleSubmit(async (values) => {
    if (!review.valid || !review.reviewed || !connection.connected || storageError) return;
    form.clearErrors('root');
    try {
      await connection.verify({ walletId: selected.id, provider: selected.walletType });
      await create.mutateAsync({
        quoteId: review.reviewed.id,
        items: review.reviewed.items.map(({ nftId, editionId, quantity }) => ({
          nftId,
          editionId,
          quantity,
        })),
        ...(couponCode ? { couponCode } : {}),
        wallet: { walletId: selected.id, provider: selected.walletType, network: selected.network },
        collector: {
          displayName: values.displayName,
          email: values.email,
          ensName: values.ensName,
          note: values.note ?? '',
        },
      });
    } catch (error) {
      if (
        error instanceof ApiError &&
        ['WALLET_REJECTED', 'WALLET_DISCONNECTED'].includes(error.code)
      )
        return;
      applyFormError(error, form.setError);
    }
  });
  const pendingMessage =
    create.error instanceof ApiError ? errorMessage(create.error) : create.error?.message;
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={(event) => {
          void submit(event);
        }}
        className="grid gap-8 px-1 pb-28 lg:grid-cols-[minmax(0,1fr)_408px] lg:px-0 lg:pb-0"
      >
        <fieldset disabled={create.isPending || connection.connecting} className="contents">
          <CollectorForm wallet={selected} wallets={savedWallets} select={select} />
          <div className="order-1 flex min-w-0 flex-col gap-6 lg:order-2">
            <div className="order-2 lg:order-1">
              <OrderReview quote={review.query.data} loading={review.query.isPending} />
            </div>
            <div className="order-1 lg:order-3">
              <WalletNetworkPicker
                wallets={savedWallets}
                selected={selected}
                select={select}
                connection={connection}
              />
            </div>
            <div className="order-3 lg:order-2">
              <StaleQuoteBanner state={review} />
            </div>
            <div className="order-4 space-y-4">
              {storageError && (
                <p role="alert" className="text-xs text-text-coral">
                  {checkoutMessages.draftError}
                </p>
              )}
              <RootFormError />
              {pendingMessage && (
                <p role="alert" className="text-xs text-text-coral">
                  {pendingMessage}
                </p>
              )}
              {pending && !pending.orderId && create.isError && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={create.isPending}
                  onClick={() => {
                    create.mutate(pending.payload);
                  }}
                >
                  Recuperar pedido
                </Button>
              )}
              <SubmitOrderButton
                pending={create.isPending || connection.connecting}
                disabled={
                  !review.valid ||
                  !connection.connected ||
                  create.isPending ||
                  connection.connecting ||
                  storageError
                }
              />
            </div>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
