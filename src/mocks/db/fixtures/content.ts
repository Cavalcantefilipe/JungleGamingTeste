import type { Content } from '@/contracts/content';

import { createArtwork } from './images';

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
      title: 'Como funciona a propriedade de NFTs?',
      description: 'Entenda a tecnologia por trás da sua coleção digital.',
      image: image(2),
      dateLabel: '12 de setembro',
      readingLabel: 'Leitura de 6 min',
    },
    {
      title: 'Os artistas digitais para acompanhar',
      description: 'Conheça os criadores que estão transformando a arte.',
      image: image(0),
      dateLabel: '12 de setembro',
      readingLabel: 'Leitura de 6 min',
    },
    {
      title: 'Novidades, edições e comunidade',
      description: 'O que acontece quando arte, tecnologia e cultura se encontram.',
      image: image(1),
      dateLabel: '12 de setembro',
      readingLabel: 'Leitura de 6 min',
    },
    {
      title: 'Como proteger sua carteira',
      description: 'Uma introdução aos cuidados com sua coleção.',
      image: image(6),
      dateLabel: '12 de setembro',
      readingLabel: 'Leitura de 6 min',
    },
  ],
};
