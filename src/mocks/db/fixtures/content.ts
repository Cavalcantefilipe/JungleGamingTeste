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
      title: 'Lançamentos únicos de edição limitada',
      description: 'Descubra novas peças e encontre sua próxima coleção.',
      image: image(0),
    },
    {
      title: 'Arte digital, possibilidades infinitas',
      description: 'Obras originais para uma nova geração de colecionadores.',
      image: image(3),
    },
  ],
  articles: [
    {
      title: 'Como funciona a propriedade de NFTs?',
      description: 'Entenda a tecnologia por trás da sua coleção digital.',
      image: image(3),
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
      image: image(5),
      dateLabel: '12 de setembro',
      readingLabel: 'Leitura de 6 min',
    },
  ],
};
