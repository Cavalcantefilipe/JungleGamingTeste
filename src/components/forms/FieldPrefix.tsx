export function FieldPrefix({ value }: { value: string | undefined }) {
  if (!value) return null;
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-[78px] shrink-0 items-center justify-center rounded-field border border-input text-body-sm md:h-10"
    >
      {value}
    </span>
  );
}
