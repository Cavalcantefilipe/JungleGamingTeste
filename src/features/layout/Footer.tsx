import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FooterLink } from './FooterLink';
import { layoutMessages } from './messages';
import { OutOfScopeLink } from './OutOfScopeLink';
import {
  FacebookGlyph,
  InstagramGlyph,
  LinkedinGlyph,
  TwitterGlyph,
  YoutubeGlyph,
} from './SocialIcons';

const FEATURES = [
  {
    letter: 'W',
    title: 'Segurança da carteira',
    text: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    letter: 'C',
    title: 'Criadores em destaque',
    text: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    letter: 'D',
    title: 'Alertas de lançamentos',
    text: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
  },
];

const LINK_COLUMNS = [
  {
    title: 'Meu perfil',
    links: ['Meu perfil', 'Minhas carteiras', 'Minha coleção', 'Atividade', 'Lista de interesse'],
  },
  {
    title: 'Central de ajuda',
    links: [
      'Central de ajuda',
      'Como comprar NFTs',
      'Carteira e segurança',
      'Política do mercado',
      'Denunciar item',
    ],
  },
  { title: 'Coleções', links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'] },
];

const SOCIAL = [
  { label: 'Facebook', Icon: FacebookGlyph },
  { label: 'Instagram', Icon: InstagramGlyph },
  { label: 'Twitter', Icon: TwitterGlyph },
  { label: 'LinkedIn', Icon: LinkedinGlyph },
  { label: 'YouTube', Icon: YoutubeGlyph },
];

function Newsletter() {
  const [email, setEmail] = useState('');
  return (
    <form
      aria-label="Newsletter"
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        toast.info(layoutMessages.newsletterUnavailable);
      }}
    >
      <h2 className="text-body-lg font-bold text-foreground">Antecipe-se ao próximo lançamento</h2>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          E-mail para novidades
        </label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder="digite seu e-mail..."
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <Button type="submit">Enviar</Button>
      </div>
      <p className="text-caption text-text-secondary">
        Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
      </p>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-ink pb-20 md:pb-0">
      <div className="mx-auto w-full max-w-[1200px] px-6 xl:px-0">
        <div className="grid gap-8 border-t border-border py-10 md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3 lg:pr-6">
              <span
                aria-hidden
                className="grid size-16 place-items-center rounded-full bg-amber text-heading-sm font-bold text-ink"
              >
                {feature.letter}
              </span>
              <h2 className="text-body-lg font-bold text-foreground">{feature.title}</h2>
              <p className="text-body text-text-secondary">{feature.text}</p>
            </div>
          ))}
          <div className="lg:pl-6">
            <Newsletter />
          </div>
        </div>
      </div>
      <div className="bg-surface-dark">
        <div className="mx-auto grid max-w-[1200px] gap-4 px-6 py-8 text-body text-foreground md:grid-cols-2 md:items-center lg:grid-cols-4 xl:px-0">
          <span className="text-body-lg font-bold tracking-[0.25em]">KURIO</span>
          <p className="text-text-secondary">{layoutMessages.brandTagline}</p>
          <a href="mailto:contato@email.com" className="hover:text-primary">
            contato@email.com
          </a>
          <a href="tel:+551140028922" className="hover:text-primary">
            +55 11 4002 8922
          </a>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-10 md:grid-cols-2 lg:grid-cols-4 xl:px-0">
        {LINK_COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h2 className="text-body-lg font-bold text-foreground">{column.title}</h2>
            <ul className="flex flex-col gap-2 text-body text-text-secondary">
              {column.links.map((link) => (
                <li key={link}>
                  <FooterLink label={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-body-lg font-bold text-foreground">Redes sociais</h2>
            <ul className="flex gap-2">
              {SOCIAL.map(({ label, Icon }) => (
                <li key={label}>
                  <OutOfScopeLink className="grid size-11 place-items-center rounded-control border border-border-soft text-foreground hover:border-primary">
                    <Icon className="size-4" />
                    <span className="sr-only">{label}</span>
                  </OutOfScopeLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-body-lg font-bold text-foreground">Carteiras compatíveis</h2>
            <p className="rounded-control border border-border-soft px-3 py-2 text-tiny font-medium tracking-wider text-text-secondary">
              METAMASK · WALLETCONNECT · COINBASE
            </p>
          </div>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center text-caption text-text-secondary">
        {layoutMessages.copyright}
      </p>
    </footer>
  );
}
