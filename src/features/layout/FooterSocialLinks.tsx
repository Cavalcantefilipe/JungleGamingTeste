import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

const socialLinks = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'];
function unavailable() {
  toast.info('Conteúdo indisponível nesta demonstração');
}
export function FooterSocialLinks() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-3 text-lg leading-4 font-bold">Redes sociais</h2>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((label) => (
            <Button
              key={label}
              variant="ghost"
              size="footer-social"
              aria-label={label}
              onClick={unavailable}
            >
              <img
                src={`/images/ui/footer-${label.toLowerCase()}.svg`}
                alt=""
                width={32}
                height={32}
                className="size-8"
              />
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-lg leading-4 font-bold">Carteiras compatíveis</h2>
        <p className="w-fit rounded-control border border-border-soft bg-surface-dark px-2.5 py-1.5 text-[9px] leading-3 font-bold text-text-accent">
          METAMASK · WALLETCONNECT · COINBASE
        </p>
      </div>
    </div>
  );
}
