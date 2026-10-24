import type { Content } from '@/contracts/content';
import { createArtwork } from '@/mocks/db/fixtures/images';

const image = (index: number) => ({
  src: createArtwork(index),
  alt: 'Arte da coleção Kurio Apes',
  width: 600,
  height: 600,
});
export const content: Content = {
  promotions: [
    {
      title: 'Lançamentos gênesis de edição limitada',
      description:
        'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
      image: image(0),
    },
    {
      title: 'Arte digital selecionada e muito mais',
      description:
        'Explore novos artistas, coleções verificadas e obras digitais que definem a cena.',
      image: image(2),
    },
  ],
  articles: [
    {
      title: 'Como funciona a propriedade de NFTs',
      description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
      image: image(2),
      dateLabel: '12 de setembro',
      readingLabel: 'Leitura de 6 min',
    },
    {
      title: '10 artistas digitais para acompanhar',
      description: 'Conheça criadores que moldam a cultura digital.',
      image: image(0),
      dateLabel: '13 de setembro',
      readingLabel: 'Leitura de 2 min',
    },
    {
      title: 'Raridade, atributos e procedência',
      description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
      image: image(1),
      dateLabel: '15 de setembro',
      readingLabel: 'Leitura de 3 min',
    },
    {
      title: 'Como proteger sua carteira',
      description: 'Proteja sua carteira, seus ativos e sua identidade.',
      image: image(6),
      dateLabel: '15 de setembro',
      readingLabel: 'Leitura de 2 min',
    },
  ],
};
