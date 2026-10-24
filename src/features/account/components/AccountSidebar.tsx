import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { AccountNavigationLinks } from '@/features/account/components/AccountNavigationLinks';
import { useLogout } from '@/features/auth/mutations';

export function AccountSidebar() {
  const logout = useLogout();
  return (
    <aside className="h-fit bg-surface-card pt-4">
      <h2 className="mb-2 px-2.5 text-lg leading-4 font-bold">Meu perfil</h2>
      <nav aria-label="Menu da conta" className="flex flex-wrap gap-1 md:flex-col md:gap-0">
        <AccountNavigationLinks />
        <Button
          variant="ghost"
          className="justify-start rounded-none px-4 text-body-sm font-bold text-text-accent md:min-h-[49px] md:border-t md:border-border-soft"
          disabled={logout.isPending}
          onClick={() => {
            logout.mutate();
          }}
        >
          <FigmaIcon name="logout" aria-hidden="true" size={20} />
          Sair
        </Button>
      </nav>
    </aside>
  );
}
