import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { catalogMessages } from '../messages';
import { useCatalogNavigation } from '../useCatalogNavigation';

export const PRICE_MIN = 0.02;
export const PRICE_MAX = 12.3;
const PRICE_STEP = 0.01;

const formatPrice = (value: number) => value.toFixed(2).replace('.', ',');

export function PriceRangeFilter() {
  const { search, setFilter } = useCatalogNavigation();
  const applied: [number, number] = [
    search.minPrice ? Number(search.minPrice) : PRICE_MIN,
    search.maxPrice ? Number(search.maxPrice) : PRICE_MAX,
  ];
  const [draft, setDraft] = useState<{ range: [number, number]; base: string }>({
    range: applied,
    base: `${search.minPrice ?? ''}|${search.maxPrice ?? ''}`,
  });
  const currentBase = `${search.minPrice ?? ''}|${search.maxPrice ?? ''}`;
  const range = draft.base === currentBase ? draft.range : applied;

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 text-body-lg font-bold text-foreground">
        {catalogMessages.priceRange}
      </legend>
      <Slider
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        minStepsBetweenThumbs={1}
        value={range}
        thumbLabels={['Preço mínimo', 'Preço máximo']}
        onValueChange={(next) => {
          const [min = PRICE_MIN, max = PRICE_MAX] = next;
          setDraft({ range: [min, max], base: currentBase });
        }}
      />
      <p className="text-caption text-text-secondary">
        Preço: {formatPrice(range[0])} - {formatPrice(range[1])} ETH
      </p>
      <div>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            void setFilter({
              minPrice: range[0] > PRICE_MIN ? range[0].toFixed(2) : undefined,
              maxPrice: range[1] < PRICE_MAX ? range[1].toFixed(2) : undefined,
            });
          }}
        >
          {catalogMessages.apply}
        </Button>
      </div>
    </fieldset>
  );
}
