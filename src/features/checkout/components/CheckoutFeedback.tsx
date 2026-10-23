import { RootFormError } from '@/components/forms/RootFormError';
import { ApiError, errorMessage } from '@/lib/errors';

import { checkoutMessages } from '../messages';

import type { useCheckoutController } from '../useCheckoutController';

export function CheckoutFeedback({ state }: { state: ReturnType<typeof useCheckoutController> }) {
  const { storageError, create } = state;
  const pendingMessage =
    create.error instanceof ApiError ? errorMessage(create.error) : create.error?.message;
  return (
    <>
      {storageError && (
        <p role="alert" className="text-xs text-text-coral">
          {checkoutMessages.draftError}
        </p>
      )}
      {!create.error && <RootFormError />}
      {pendingMessage && (
        <p role="alert" className="text-xs text-text-coral">
          {pendingMessage}
        </p>
      )}
    </>
  );
}
