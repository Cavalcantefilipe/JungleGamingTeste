import { Eye } from 'lucide-react';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';

export function PasswordVisibilityToggle({
  visible,
  label,
  toggle,
}: {
  visible: boolean;
  label: string;
  toggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="quantity"
      className="absolute top-1/2 right-0 -translate-y-1/2 text-secondary"
      aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label}`}
      aria-pressed={visible}
      onClick={toggle}
    >
      {visible ? <Eye className="size-5" /> : <FigmaIcon name="hide" size={20} />}
    </Button>
  );
}
