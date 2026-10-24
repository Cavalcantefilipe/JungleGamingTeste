import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      closeButton
      toastOptions={{ closeButtonAriaLabel: 'Fechar notificação' }}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--color-surface-raised)',
          '--normal-text': 'var(--color-foreground)',
          '--normal-border': 'var(--color-border-soft)',
          '--border-radius': 'var(--radius-control)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
