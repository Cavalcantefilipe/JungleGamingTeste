import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { CatalogSearch } from '@/features/catalog/search-params';

export function PriceRangeFilter({
  search,
  apply,
}: {
  search: CatalogSearch;
  apply: (values: Partial<CatalogSearch>) => void;
}) {
  const [range, setRange] = useState([
    Number(search.minPrice ?? '0.02'),
    Number(search.maxPrice ?? '12.3'),
  ]);
  return (
    <section className="space-y-5 border-t py-6">
      <h3 className="text-sm font-bold">Faixa de preço</h3>
      <Slider min={0.02} max={12.3} step={0.01} value={range} onValueChange={setRange} />
      <div className="flex justify-between text-xs text-text-secondary">
        <span>{range[0]?.toFixed(2)} ETH</span>
        <span>{range[1]?.toFixed(2)} ETH</span>
      </div>
      <Button
        onClick={() => {
          apply({ minPrice: String(range[0] ?? 0.02), maxPrice: String(range[1] ?? 12.3) });
        }}
      >
        Aplicar
      </Button>
    </section>
  );
}
