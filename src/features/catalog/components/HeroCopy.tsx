import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HeroCopy() {
  return (
    <div className="relative z-10 w-[58%] max-w-[190px] space-y-1 md:w-full md:max-w-[600px] md:space-y-4">
      <p className="text-[11px] leading-4 text-foreground md:text-sm md:leading-6 md:font-medium md:tracking-[0.1em]">
        Bem-vindo à Kurio
      </p>
      <h1 className="text-[18px] leading-[29px] font-bold md:text-[32px] md:leading-[48px] xl:text-display xl:leading-[70px]">
        <span className="md:hidden">SEJA DONO DA CULTURA DIGITAL</span>
        <span className="hidden md:inline">
          SEJA DONO DO FUTURO
          <br />
          DA ARTE DIGITAL
        </span>
      </h1>
      <p className="text-xs leading-[18px] text-text-secondary md:text-sm md:leading-6">
        <span className="md:hidden">Descubra NFTs selecionados de criadores do mundo todo.</span>
        <span className="hidden md:inline">
          Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital
          rara, apoie artistas e tenha uma parte da cultura da internet.
        </span>
      </p>
      <div className="hidden pt-4 md:block">
        <Button asChild className="w-[140px] px-0">
          <a href="#catalogo">EXPLORAR</a>
        </Button>
      </div>
      <a
        href="#catalogo"
        className="absolute top-[122px] left-0 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-primary hover:text-primary-light md:hidden"
      >
        EXPLORAR
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}
