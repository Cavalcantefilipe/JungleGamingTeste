import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-12', className)} {...props} />
      <button
        type="button"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        onClick={() => {
          setVisible((current) => !current);
        }}
        className="absolute top-1/2 right-0 grid size-11 -translate-y-1/2 place-items-center rounded-sm text-text-secondary hover:text-foreground"
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
}
