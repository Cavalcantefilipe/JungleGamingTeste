export const HERO = {
  eyebrow: 'Bem-vindo à Kurio',
  title: 'Seja dono do futuro da arte digital',
  description:
    'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
  cta: 'Explorar',
  image: {
    src: '/images/hero/ape-hero.svg',
    alt: 'Macaco estilizado de óculos escuros e jaqueta verde, mascote da Kurio',
    width: 450,
    height: 450,
  },
} as const;

export const PROMOS = [
  {
    title: 'Lançamentos gênesis de edição limitada',
    text: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    image: '/images/nfts/art-02.svg',
  },
  {
    title: 'Arte digital selecionada e muito mais',
    text: 'Explore novos artistas, coleções verificadas e obras digitais que definem a era.',
    image: '/images/nfts/art-07.svg',
  },
] as const;

export const BLOG = {
  title: 'Diário da Cunhagem',
  subtitle:
    'Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.',
  posts: [
    {
      date: '12 de setembro',
      readingTime: 'Leitura de 6 min',
      title: 'Como funciona a propriedade de NFTs',
      excerpt: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
      image: '/images/nfts/art-04.svg',
    },
    {
      date: '13 de setembro',
      readingTime: 'Leitura de 2 min',
      title: '10 artistas digitais para acompanhar',
      excerpt: 'Conheça criadores que moldam a cultura digital.',
      image: '/images/nfts/art-05.svg',
    },
    {
      date: '15 de setembro',
      readingTime: 'Leitura de 3 min',
      title: 'Raridade, atributos e procedência',
      excerpt: 'Entenda raridade, procedência, direitos autorais e utilidade.',
      image: '/images/nfts/art-09.svg',
    },
    {
      date: '15 de setembro',
      readingTime: 'Leitura de 2 min',
      title: 'Como proteger sua carteira',
      excerpt: 'Proteja sua carteira, seus ativos e sua identidade.',
      image: '/images/nfts/art-11.svg',
    },
  ],
} as const;
