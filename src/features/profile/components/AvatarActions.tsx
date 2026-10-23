import { Button } from '@/components/ui/button';

interface AvatarActionsProps {
  disabled: boolean;
  hasAvatar: boolean;
  change: () => void;
  remove: () => void;
}
export function AvatarActions({ disabled, hasAvatar, change, remove }: AvatarActionsProps) {
  return (
    <>
      <Button size="form" type="button" disabled={disabled} onClick={change}>
        Alterar
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="form"
        aria-label="Remover avatar"
        disabled={disabled || !hasAvatar}
        onClick={remove}
      >
        Remover
      </Button>
    </>
  );
}
