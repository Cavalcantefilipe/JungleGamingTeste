import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_account/account/wallets')({ component: WalletsPage });

function WalletsPage() {
  return <h1 className="text-heading font-bold text-foreground">Carteiras</h1>;
}
