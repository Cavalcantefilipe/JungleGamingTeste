import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { authMessages } from '../messages';

function GoogleMark() {
  return (
    <span
      aria-hidden
      className="grid size-4 place-items-center rounded-full bg-white text-[10px] font-bold text-black"
    >
      G
    </span>
  );
}

function FacebookMark() {
  return (
    <span
      aria-hidden
      className="grid size-4 place-items-center rounded-full bg-[#1877F2] text-[11px] font-bold text-white"
    >
      f
    </span>
  );
}

export function SocialButtons() {
  const notify = () => {
    toast.info(authMessages.socialUnavailable);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-caption text-text-secondary">{authMessages.continueWith}</p>
      <Button type="button" variant="secondary" className="w-full" onClick={notify}>
        <GoogleMark />
        Continuar com Google
      </Button>
      <Button type="button" variant="secondary" className="w-full" onClick={notify}>
        <FacebookMark />
        Continuar com Facebook
      </Button>
    </div>
  );
}
