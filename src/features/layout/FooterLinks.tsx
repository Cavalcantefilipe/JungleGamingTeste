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
      className="grid grid-cols-1 gap-8 bg-surface-card p-8 min-[390px]:grid-cols-2 md:grid-cols-4 xl:h-[236px] xl:grid-cols-[repeat(4,228px)] xl:justify-between xl:gap-0"
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
          <h2 className="mb-3 text-lg leading-4 font-bold">Redes sociais</h2>
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
          <h2 className="mb-2 text-lg leading-4 font-bold">Carteiras compatíveis</h2>
          <p className="w-fit rounded-control border border-border-soft bg-surface-dark px-2.5 py-1.5 text-[9px] leading-3 font-bold text-text-accent">
            METAMASK · WALLETCONNECT · COINBASE
          </p>
        </div>
      </div>
    </div>
  );
}
