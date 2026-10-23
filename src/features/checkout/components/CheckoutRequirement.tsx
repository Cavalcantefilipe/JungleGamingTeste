import { Link } from '@tanstack/react-router';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';

export function CheckoutRequirement({ emptyCart }: { emptyCart: boolean }) {
  return emptyCart ? (
    <EmptyState
      title="Seu carrinho está vazio"
      description="Escolha um NFT antes de iniciar o pagamento."
      action={
        <Button asChild>
          <Link to="/">Explorar NFTs</Link>
        </Button>
      }
    />
  ) : (
    <EmptyState
      title="Cadastre uma carteira para continuar"
      description="Sua carteira precisa ser salva antes da compra."
      action={
        <Button asChild>
          <Link to="/account/wallets" search={{ returnTo: '/checkout' }}>
            Cadastrar carteira
          </Link>
        </Button>
      }
    />
  );
}
