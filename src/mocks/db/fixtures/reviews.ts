import type { Nft } from '@/contracts/nft';
import type { Review } from '@/contracts/review';

const authors = [
  'Marina A.',
  'Rafael M.',
  'Camila S.',
  'Lucas R.',
  'Beatriz L.',
  'Pedro C.',
  'Júlia F.',
  'Gabriel T.',
];
const comments = [
  'Gostei dos detalhes da arte e da combinação de cores. Ficou entre os favoritos da minha coleção.',
  'A imagem em alta resolução permite ver bem as texturas. A edição escolhida correspondeu ao que eu esperava.',
  'A identidade visual da coleção é muito boa. Gostaria de ver mais informações sobre o processo de criação.',
  'Foi fácil escolher a edição e acompanhar o pedido. O acabamento da ilustração me surpreendeu.',
  'As cores e a expressão do personagem têm bastante personalidade. Uma boa adição à coleção.',
  'A apresentação das edições ajudou na escolha. Pretendo acompanhar os próximos lançamentos.',
  'Gostei da composição e dos pequenos detalhes do personagem. A galeria ajuda a conhecer a obra.',
  'A arte corresponde às imagens apresentadas. A descrição poderia contar mais sobre a inspiração do artista.',
];

export function createReviews(nft: Nft): Review[] {
  const minimumRating = Math.floor(nft.rating.average);
  const extraStars = Math.round((nft.rating.average - minimumRating) * nft.rating.count);
  return Array.from({ length: nft.rating.count }, (_, index) => ({
    id: `${nft.id}-review-${index + 1}`,
    nftId: nft.id,
    author: authors[index % authors.length] ?? 'Colecionador',
    rating: minimumRating + (index < extraStars ? 1 : 0),
    comment: comments[index % comments.length] ?? comments[0] ?? '',
    createdAt: new Date(Date.UTC(2026, 9, 21 - index)).toISOString(),
    edition: index % 2 === 0 ? '1/50' : '1/10',
  }));
}
