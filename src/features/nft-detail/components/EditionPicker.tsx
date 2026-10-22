import { RadioGroup } from 'radix-ui';

import { cn } from '@/lib/cn';

import { detailMessages } from '../messages';

import type { NftEdition } from '@/contracts';

interface EditionPickerProps {
  editions: NftEdition[];
  value: string;
  onChange: (editionId: string) => void;
}

function editionLabel(edition: NftEdition): string {
  const name = edition.label === 'aberta' ? 'Aberta' : edition.label;
  const status =
    edition.available === 0 ? detailMessages.soldOut : detailMessages.available(edition.available);
  return `${name} — ${status}`;
}

export function EditionPicker({ editions, value, onChange }: EditionPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body font-bold text-foreground" id="edition-label">
        {detailMessages.edition}
      </p>
      <RadioGroup.Root
        aria-labelledby="edition-label"
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-2"
      >
        {editions.map((edition) => (
          <RadioGroup.Item
            key={edition.id}
            value={edition.id}
            disabled={edition.available === 0}
            aria-label={editionLabel(edition)}
            className={cn(
              'rounded-control border px-3 py-1.5 text-caption font-medium uppercase transition-colors',
              'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-ink',
              'data-[state=unchecked]:border-border-soft data-[state=unchecked]:text-foreground hover:data-[state=unchecked]:border-primary',
              'disabled:cursor-not-allowed disabled:line-through disabled:opacity-50',
            )}
          >
            {edition.label === 'aberta' ? 'Aberta' : edition.label}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
