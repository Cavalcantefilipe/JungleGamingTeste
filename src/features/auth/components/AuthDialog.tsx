import { useNavigate } from '@tanstack/react-router';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { resolveAuthDismissal } from '@/features/auth/resolveAuthDismissal';
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
          if (!open) void navigate({ to: resolveAuthDismissal(returnTo) });
        }}
      >
        <DialogContent
          onCloseAutoFocus={restoreFocus}
          overlayClassName="bg-transparent"
          scrollableOverlay
          className={cn(
            'relative inset-auto mx-auto flex min-h-dvh max-w-none translate-0 flex-col gap-0 rounded-none border-0 bg-ink px-7 pt-[clamp(1rem,calc(100dvh-816px),5rem)] pb-3 sm:max-w-none md:mt-[clamp(1rem,calc(100dvh-616px),10rem)] md:min-h-[min(600px,calc(100dvh-32px))] md:w-[500px] md:max-w-[500px] md:border-b-[10px] md:border-primary md:bg-surface-card md:px-0 md:pt-12 md:pb-10 md:[@media(max-height:700px)]:pt-8 md:[@media(max-height:700px)]:pb-6',
            register &&
              'md:mt-[clamp(1rem,calc(100dvh-672px),10rem)] md:min-h-[min(656px,calc(100dvh-32px))] md:rounded-lg',
          )}
        >
          <AuthDialogHeading register={register} returnTo={returnTo} />
          <AuthFormPanel register={register} returnTo={returnTo} />
        </DialogContent>
      </Dialog>
    </>
  );
}
