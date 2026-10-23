import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';

export function CartRemoveAction({
  name,
  busy,
  remove,
}: {
  name: string;
  busy: boolean;
  remove: () => void;
}) {
  return (
    <td className="absolute top-0 right-0 md:static md:table-cell md:pr-1">
      <Button
        variant="remove"
        size="icon"
        aria-label={`Remover ${name}`}
        disabled={busy}
        onClick={remove}
      >
        <FigmaIcon name="delete" aria-hidden="true" size={24} />
      </Button>
    </td>
  );
}
