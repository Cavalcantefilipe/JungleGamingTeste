import { Button } from '@/components/ui/button';

export function PriceChangedNotice({
  available,
  disabled,
  refresh,
}: {
  available: number;
  disabled: boolean;
  refresh: () => void;
}) {
  return (
    <div
      role="status"
      className="mb-2 space-y-2 rounded-xl border border-primary/60 bg-surface-raised p-4 text-xs text-text-secondary"
    >
      <p>O preço ou a disponibilidade deste NFT mudou.</p>
      {available === 0 && <p>Esta edição está esgotada. Remova o item para continuar.</p>}
      <Button variant="secondary" disabled={disabled || available === 0} onClick={refresh}>
        Atualizar carrinho
      </Button>
    </div>
  );
}
