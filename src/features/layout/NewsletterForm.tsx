import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterForm() {
  return (
    <form
      className="space-y-4 xl:pl-4"
      onSubmit={(event) => {
        event.preventDefault();
        toast.info('Newsletter indisponível nesta demonstração');
      }}
    >
      <label htmlFor="newsletter" className="block text-lg leading-4 font-bold">
        Antecipe-se ao próximo lançamento
      </label>
      <div className="flex">
        <Input
          id="newsletter"
          aria-label="E-mail para newsletter"
          placeholder="Digite seu e-mail..."
          type="email"
          required
          className="min-w-0 rounded-r-none border-0 bg-surface-dark text-sm"
        />
        <Button type="submit" className="rounded-l-none px-3 text-lg font-bold">
          Enviar
        </Button>
      </div>
      <p className="text-caption leading-[22px] text-text-secondary">
        Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
      </p>
    </form>
  );
}
