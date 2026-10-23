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
    <fieldset>
      <legend className="mb-2 text-sm leading-4 font-bold">Edição:</legend>
      <div className="flex flex-wrap gap-2">
        {editions.map((edition) => (
          <Button
            key={edition.id}
            variant="edition"
            size="edition"
            aria-pressed={value === edition.id}
            aria-disabled={edition.available === 0}
            disabled={edition.available === 0}
            onClick={() => {
              onChange(edition.id);
            }}
          >
            {edition.label.toUpperCase()}
            {edition.available === 0 ? ' · Esgotada' : ''}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
