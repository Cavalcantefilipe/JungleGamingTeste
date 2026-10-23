import { Button } from '@/components/ui/button';

export function AppliedCoupon({ code, remove }: { code: string; remove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-text-secondary">
      <span>{code}</span>
      <Button variant="ghost" type="button" aria-label="Remover cupom" onClick={remove}>
        Remover
      </Button>
    </div>
  );
}
