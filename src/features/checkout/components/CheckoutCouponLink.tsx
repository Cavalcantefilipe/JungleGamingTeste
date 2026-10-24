import { Link } from '@tanstack/react-router';

export function CheckoutCouponLink() {
  return (
    <p className="mb-3 flex flex-wrap items-center justify-center gap-x-1 text-center text-sm">
      Tem um código promocional?
      <Link
        to="/cart"
        hash="coupon-code"
        className="inline-flex min-h-11 items-center rounded-control px-1 text-text-accent underline underline-offset-4 hover:text-primary-light focus-visible:ring-2 focus-visible:ring-primary active:text-primary-dark"
      >
        Aplique aqui
      </Link>
    </p>
  );
}
