import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useShareLink() {
  return useMutation({
    mutationFn: () => navigator.clipboard.writeText(location.href),
    onSuccess: () => toast.success('Link copiado'),
    onError: () => toast.error('Não foi possível copiar o link'),
  });
}
