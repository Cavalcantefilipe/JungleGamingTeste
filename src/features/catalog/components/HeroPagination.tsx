import type { Nft } from '@/contracts/nft';

interface HeroPaginationProps {
  items: Nft[];
  selected: number;
  select: (index: number) => void;
}
export function HeroPagination({ items, selected, select }: HeroPaginationProps) {
  return (
    <div className="absolute right-0 bottom-0 flex min-[390px]:right-auto min-[390px]:left-1/2 min-[390px]:-translate-x-1/2 md:bottom-10 md:left-[64%] md:gap-2 lg:left-[60%] xl:left-[56%]">
      {items.map((item, index) => (
        <button
          key={item.id}
          aria-label={`Mostrar destaque ${index + 1}`}
          aria-pressed={selected === index}
          onClick={() => {
            select(index);
          }}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full md:size-4"
        >
          <span
            className={`size-1.5 translate-y-3.5 rounded-full md:translate-y-0 ${selected === index ? 'bg-primary' : 'bg-border-soft'}`}
          />
        </button>
      ))}
    </div>
  );
}
