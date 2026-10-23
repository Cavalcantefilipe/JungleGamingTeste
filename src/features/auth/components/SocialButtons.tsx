import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function SocialButtons() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-caption text-foreground md:-mx-20">
        <span className="h-px flex-1 bg-border" />
        Ou continue com
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 md:gap-3">
        {['Google', 'Facebook'].map((provider) => (
          <Button
            key={provider}
            variant="social"
            size="social"
            onClick={() => toast.info('Login social indisponível nesta demonstração')}
          >
            <img
              src={`/images/ui/${provider.toLowerCase()}.svg`}
              alt=""
              className="size-5"
              width={20}
              height={20}
            />
            Continuar com {provider}
          </Button>
        ))}
      </div>
    </div>
  );
}
