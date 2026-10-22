import { Link } from '@tanstack/react-router';
import { ArrowRight, Gem, Palette, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="page-container mt-24 pb-28 lg:pb-8">
      <div className="grid gap-8 rounded-t-xl bg-surface-card p-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-3">
          <ShieldCheck className="size-11 rounded-full bg-amber p-3 text-ink" aria-hidden="true" />
          <h2 className="text-sm font-bold">Segurança de verdade</h2>
          <p className="text-xs leading-5 text-text-secondary">
            Propriedade digital e uma experiência feita para colecionar com confiança.
          </p>
        </div>
        <div className="space-y-3">
          <Palette className="size-11 rounded-full bg-amber p-3 text-ink" aria-hidden="true" />
          <h2 className="text-sm font-bold">Criadores em destaque</h2>
          <p className="text-xs leading-5 text-text-secondary">
            Conecte-se com artistas que estão desenhando o próximo capítulo da arte.
          </p>
        </div>
        <div className="space-y-3">
          <Gem className="size-11 rounded-full bg-amber p-3 text-ink" aria-hidden="true" />
          <h2 className="text-sm font-bold">Curadoria de lançamentos</h2>
          <p className="text-xs leading-5 text-text-secondary">
            Descubra novas coleções, edições limitadas e peças que fazem história.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            toast.info('Newsletter indisponível nesta demonstração');
          }}
        >
          <label htmlFor="newsletter" className="text-sm font-bold">
            Antecipe-se ao próximo lançamento
          </label>
          <div className="flex gap-2">
            <Input
              id="newsletter"
              aria-label="E-mail para newsletter"
              placeholder="Digite seu e-mail..."
              type="email"
              required
              className="min-w-0 text-xs"
            />
            <Button type="submit" size="icon" aria-label="Enviar">
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <p className="text-xs leading-5 text-text-secondary">
            Novidades, curadoria e cultura digital na sua caixa de entrada.
          </p>
        </form>
      </div>
      <div className="flex flex-col justify-between gap-4 bg-surface-dark px-6 py-6 text-xs text-text-secondary md:flex-row">
        <strong className="text-base tracking-[0.2em] text-foreground">KURIO</strong>
        <p>Feito para colecionadores, criadores e cultura</p>
        <span>contato@email.com</span>
        <span>+55 11 4002 8922</span>
      </div>
      <div className="grid grid-cols-2 gap-8 bg-surface-card p-6 md:grid-cols-4">
        <div className="footer-links">
          <h2>Meu perfil</h2>
          <Link to="/account/profile">Meus dados</Link>
          <Link to="/account/wallets">Minhas carteiras</Link>
          <Link to="/cart">Meu carrinho</Link>
        </div>
        {['Central de ajuda', 'Coleções', 'Redes sociais'].map((section) => (
          <div key={section} className="footer-links">
            <h2>{section}</h2>
            {(section === 'Coleções'
              ? ['Arte digital', 'Fotografia', 'Música']
              : section === 'Redes sociais'
                ? ['Instagram', 'Discord', 'X / Twitter']
                : ['Dúvidas frequentes', 'Como comprar', 'Fale conosco']
            ).map((label) => (
              <button
                key={label}
                onClick={() => toast.info('Conteúdo indisponível nesta demonstração')}
              >
                {label}
              </button>
            ))}
            {section === 'Redes sociais' && (
              <p className="pt-3 text-xs leading-5 text-text-secondary">
                Carteiras compatíveis
                <br />
                METAMASK · WALLETCONNECT · COINBASE
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="border-t py-6 text-center text-xs text-text-secondary">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}
