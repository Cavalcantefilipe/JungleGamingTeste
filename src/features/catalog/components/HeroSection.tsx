import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Nft } from '@/contracts/nft';

export function HeroSection({ items, loading = false }: { items: Nft[]; loading?: boolean }) {
  const [selected, setSelected] = useState(0);
  const featured = items.slice(0, 3);
  const nft = featured[selected] ?? featured[0];
  return (
    <section className="mb-16 grid items-center gap-8 rounded-2xl bg-surface-card p-6 sm:mb-24 sm:bg-transparent sm:p-0 lg:grid-cols-[1fr_450px]">
      <div className="space-y-6">
        <p className="text-sm text-text-secondary">Bem-vindo à Kurio</p>
        <h1 className="max-w-xl text-[28px] leading-[1.6] font-bold sm:text-display">
          SEJA DONO DO FUTURO DA ARTE DIGITAL
        </h1>
        <p className="max-w-lg text-sm leading-6 text-text-secondary">
          Explore NFTs exclusivos de artistas emergentes e consagrados. Descubra arte digital, crie
          conexões e faça parte do futuro da cultura.
        </p>
        <Button asChild className="mt-2">
          <a href="#catalogo">EXPLORAR</a>
        </Button>
      </div>
      <div className="min-w-0 space-y-5">
        {loading ? (
          <Skeleton className="aspect-square w-full rounded-3xl" />
        ) : nft ? (
          <img
            src={nft.images[0]?.src}
            alt={nft.images[0]?.alt ?? nft.name}
            width={450}
            height={450}
            fetchPriority="high"
            className="aspect-square w-full rounded-3xl object-cover"
          />
        ) : (
          <div className="aspect-square rounded-3xl bg-surface-raised" />
        )}
        <div className="flex justify-end gap-1">
          {featured.map((item, index) => (
            <button
              key={item.id}
              aria-label={`Mostrar destaque ${index + 1}`}
              aria-pressed={selected === index}
              onClick={() => {
                setSelected(index);
              }}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full"
            >
              <span
                className={`size-1.5 rounded-full ${selected === index ? 'bg-primary' : 'bg-border-soft'}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
