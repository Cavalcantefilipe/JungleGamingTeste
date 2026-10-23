import { Button } from '@/components/ui/button';

export function SubmitOrderButton({ disabled, pending }: { disabled: boolean; pending: boolean }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-[32px] bg-ink px-7 pt-6 pb-[max(32px,env(safe-area-inset-bottom))] lg:static lg:bg-transparent lg:p-0">
      <Button type="submit" size="confirmation" className="w-full" disabled={disabled}>
        {pending ? 'Confirmando…' : 'Confirmar compra'}
      </Button>
    </div>
  );
}
