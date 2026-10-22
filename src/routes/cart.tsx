import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cart')({ component: Cart });
function Cart() {
  return <h1 className="text-heading">Carrinho de NFTs</h1>;
}
