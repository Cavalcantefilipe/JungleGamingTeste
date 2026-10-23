import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

const sections = [
  {
    title: 'Central de ajuda',
    labels: [
      'Central de ajuda',
      'Como comprar NFTs',
      'Carteira e segurança',
      'Política do mercado',
      'Denunciar item',
    ],
  },
  { title: 'Coleções', labels: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'] },
];
const socialLinks = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'];

function unavailable() {
  toast.info('Conteúdo indisponível nesta demonstração');
}

export function FooterLinks() {
  return (
    <div
      data-testid="footer-links"
      className="grid grid-cols-2 gap-8 bg-surface-card p-8 md:grid-cols-4 xl:h-[236px] xl:gap-4 xl:py-6"
    >
      <div className="footer-links">
        <h2>Meu perfil</h2>
        <Link to="/account/profile">Meu perfil</Link>
        <Link to="/account/wallets">Minhas carteiras</Link>
        <button onClick={unavailable}>Minha coleção</button>
        <button onClick={unavailable}>Atividade</button>
        <Link to="/" search={{ favorites: true }}>
          Lista de interesse
        </Link>
      </div>
      {sections.map((section) => (
        <div key={section.title} className="footer-links">
          <h2>{section.title}</h2>
          {section.labels.map((label) => (
            <button key={label} onClick={unavailable}>
              {label}
            </button>
          ))}
        </div>
      ))}
      <div className="space-y-5">
        <div>
          <h2 className="mb-3 text-base font-bold">Redes sociais</h2>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((label) => (
              <Button
                key={label}
                variant="ghost"
                size="footer-social"
                aria-label={label}
                onClick={unavailable}
              >
                <img
                  src={`/images/ui/footer-${label.toLowerCase()}.svg`}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8"
                />
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-base font-bold">Carteiras compatíveis</h2>
          <p className="rounded-control border border-border bg-surface-raised px-2 py-1 text-[8px] text-primary">
            METAMASK · WALLETCONNECT · COINBASE
          </p>
        </div>
      </div>
    </div>
  );
}
