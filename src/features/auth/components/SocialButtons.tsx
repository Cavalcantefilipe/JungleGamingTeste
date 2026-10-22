import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function SocialButtons() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <span className="h-px flex-1 bg-border" />
        Ou continue com
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {['Google', 'Facebook'].map((provider) => (
          <Button
            key={provider}
            variant="secondary"
            onClick={() => toast.info('Login social indisponível nesta demonstração')}
          >
            {provider}
          </Button>
        ))}
      </div>
    </div>
  );
}
