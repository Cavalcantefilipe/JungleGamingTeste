import { CheckoutSubmit } from '@/features/checkout/components/CheckoutSubmit';
import { OrderReview } from '@/features/checkout/components/OrderReview';
import { StaleQuoteBanner } from '@/features/checkout/components/StaleQuoteBanner';
import { WalletNetworkPicker } from '@/features/checkout/components/WalletNetworkPicker';
import type { useCheckoutController } from '@/features/checkout/useCheckoutController';

export function CheckoutReviewPanel({
  state,
}: {
  state: ReturnType<typeof useCheckoutController>;
}) {
  const { review, savedWallets, selected, select, connection } = state;
  return (
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
      <CheckoutSubmit state={state} />
    </div>
  );
}
