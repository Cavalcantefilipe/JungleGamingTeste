import { DialogDescription, DialogTitle } from '@/components/ui/dialog';

export function ReceiptHeading() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 pt-6 pb-5 text-center">
      <img
        src="/images/ui/thank-you.svg"
        alt=""
        width={80}
        height={80}
        className="mx-auto size-20"
      />
      <DialogTitle className="text-base leading-4 font-bold text-text-secondary">
        Seus NFTs agora estão na sua carteira
      </DialogTitle>
      <DialogDescription className="sr-only">
        Compra confirmada na simulação. Detalhes da transação e dos NFTs adquiridos.
      </DialogDescription>
    </div>
  );
}
