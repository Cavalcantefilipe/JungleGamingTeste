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
      <legend className="mb-0 text-body-sm font-bold md:mb-2">Edição:</legend>
      <div className="flex flex-wrap gap-1 md:gap-1.5">
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
