import { applyFormError } from '@/components/forms/applyFormError';
import type { Wallet } from '@/contracts/wallet';
import { ApiError } from '@/lib/errors';

import { createOrderRequest } from './createOrderRequest';

import type { useCheckoutForm } from './useCheckoutForm';
import type { useCreateOrder } from './useCreateOrder';
import type { useQuoteReview } from './useQuoteReview';
import type { useWalletConnection } from './useWalletConnection';

interface SubmissionOptions {
  form: ReturnType<typeof useCheckoutForm>['form'];
  review: ReturnType<typeof useQuoteReview>;
  connection: ReturnType<typeof useWalletConnection>;
  create: ReturnType<typeof useCreateOrder>;
  wallet: Wallet;
  couponCode: string | undefined;
  storageError: boolean;
}

export function useCheckoutSubmission({
  form,
  review,
  connection,
  create,
  wallet,
  couponCode,
  storageError,
}: SubmissionOptions) {
  return form.handleSubmit(async (values) => {
    if (!review.valid || !review.reviewed || !connection.connected || storageError) return;
    form.clearErrors('root');
    try {
      await connection.verify({
        walletId: wallet.id,
        provider: wallet.walletType,
        address: wallet.address,
        network: wallet.network,
      });
      await create.mutateAsync(createOrderRequest(review.reviewed, wallet, values, couponCode));
    } catch (error) {
      if (error instanceof ApiError && error.code === 'WALLET_CHANGED') connection.reset();
      if (
        error instanceof ApiError &&
        ['WALLET_REJECTED', 'WALLET_DISCONNECTED'].includes(error.code)
      )
        return;
      applyFormError(error, form.setError);
    }
  });
}
