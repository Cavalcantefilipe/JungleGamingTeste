export function CartBadge({ quantity }: { quantity: number }) {
  if (!quantity) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] text-ink"
    >
      {quantity > 99 ? '99+' : quantity}
    </span>
  );
}
