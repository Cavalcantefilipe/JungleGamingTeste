import { LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

import { detailMessages } from '../messages';

export function CopyLinkButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-caption text-text-accent hover:underline"
      onClick={() => {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => toast.success(detailMessages.linkCopied))
          .catch(() => toast.error('Não foi possível copiar o link.'));
      }}
    >
      <LinkIcon aria-hidden className="size-3.5" />
      {detailMessages.copyLink}
    </button>
  );
}
