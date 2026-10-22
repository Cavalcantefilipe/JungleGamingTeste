import { Button } from '@/components/ui/button';
import type { NftEdition } from '@/contracts/nft';

export function EditionPicker({
  editions,
  value,
  onChange,
}: {
  editions: NftEdition[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-sm font-bold">Edição:</legend>
      <div className="flex flex-wrap gap-2">
        {editions.map((edition) => (
          <Button
            key={edition.id}
            variant={value === edition.id ? 'primary' : 'secondary'}
            aria-pressed={value === edition.id}
            aria-disabled={edition.available === 0}
            disabled={edition.available === 0}
            onClick={() => {
              onChange(edition.id);
            }}
            className="rounded-full px-3 text-xs"
          >
            {edition.label.toUpperCase()}
            {edition.available === 0 ? ' · Esgotada' : ''}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
