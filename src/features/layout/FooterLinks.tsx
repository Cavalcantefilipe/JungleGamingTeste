import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { FooterCollectionLinks } from '@/features/layout/FooterCollectionLinks';
import { FooterSocialLinks } from '@/features/layout/FooterSocialLinks';

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
];

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
      <FooterCollectionLinks />
      <FooterSocialLinks />
    </div>
  );
}
