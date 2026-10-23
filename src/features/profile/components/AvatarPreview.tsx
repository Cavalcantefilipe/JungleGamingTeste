import { FigmaIcon } from '@/components/icons/FigmaIcon';

export function AvatarPreview({ url }: { url: string | null }) {
  return url ? (
    <img
      src={url}
      alt="Avatar do colecionador"
      width={50}
      height={50}
      className="size-[50px] rounded-full object-cover"
    />
  ) : (
    <div className="flex size-[50px] items-center justify-center rounded-full border border-border bg-surface-raised text-primary">
      <FigmaIcon name="image" aria-hidden="true" size={24} />
    </div>
  );
}
