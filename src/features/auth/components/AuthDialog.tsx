import { useNavigate } from '@tanstack/react-router';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useReturnFocus } from '@/features/auth/useReturnFocus';
import { CatalogPage } from '@/features/catalog/components/CatalogPage';
import { defaultCatalogSearch } from '@/features/catalog/search-params';
import { cn } from '@/lib/cn';

import { AuthDialogHeading } from './AuthDialogHeading';
import { AuthFormPanel } from './AuthFormPanel';

export function AuthDialog({
  register = false,
  returnTo,
}: {
  register?: boolean;
  returnTo: string;
}) {
  const navigate = useNavigate();
  const restoreFocus = useReturnFocus();
  return (
    <>
      <CatalogPage search={defaultCatalogSearch} />
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) void navigate({ to: '/' });
        }}
      >
        <DialogContent
          onCloseAutoFocus={restoreFocus}
          overlayClassName="bg-transparent"
          className={cn(
            'flex max-h-dvh flex-col gap-0 overflow-y-auto rounded-none border-0 bg-ink px-7 pt-20 pb-6 max-md:inset-0 max-md:max-w-none max-md:translate-0 md:top-40 md:h-[600px] md:max-h-[calc(100dvh-176px)] md:w-[500px] md:max-w-[500px] md:translate-y-0 md:border-b-[10px] md:border-primary md:bg-surface-card md:px-0 md:pt-12 md:pb-10',
            register && 'md:h-[656px] md:rounded-lg',
          )}
        >
          <AuthDialogHeading register={register} returnTo={returnTo} />
          <AuthFormPanel register={register} returnTo={returnTo} />
        </DialogContent>
      </Dialog>
    </>
  );
}
